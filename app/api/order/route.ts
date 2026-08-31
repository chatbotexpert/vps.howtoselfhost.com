import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";

function hashFake(password: string) {
  return `hashed_secret_${password}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { planId, term, region, storageType, image, password, personalInfo, totalAmount } = body;

    // Input validation
    if (!planId || typeof planId !== "string") {
      return NextResponse.json({ error: "Invalid plan selected." }, { status: 400 });
    }
    if (!term || ![1, 12, 24].includes(Number(term))) {
      return NextResponse.json({ error: "Invalid term length. Choose 1, 12, or 24 months." }, { status: 400 });
    }
    if (!region || typeof region !== "string") {
      return NextResponse.json({ error: "Please select a valid region." }, { status: 400 });
    }
    if (!image || typeof image !== "string") {
      return NextResponse.json({ error: "Please select an operating system image." }, { status: 400 });
    }
    if (!password || password.length < 8) {
      return NextResponse.json({ error: "Server password must be at least 8 characters." }, { status: 400 });
    }
    if (typeof totalAmount !== "number" || totalAmount < 0) {
      return NextResponse.json({ error: "Invalid order amount." }, { status: 400 });
    }

    const cookieStore = await cookies();
    const sessionUserId = cookieStore.get("user_session")?.value;

    let generatedPassword = null;
    let user;

    if (sessionUserId) {
      user = await db.user.findUnique({ where: { id: sessionUserId } });
    }

    if (!user) {
      if (!personalInfo?.email) {
        return NextResponse.json({ error: "Email is required for guests." }, { status: 400 });
      }

      user = await db.user.findUnique({
        where: { email: personalInfo.email }
      });

      if (!user) {
        const bcrypt = require("bcryptjs");
        // Generate a random password for their Contabo-style account
        generatedPassword = Math.random().toString(36).slice(-10);
        const passwordHash = await bcrypt.hash(generatedPassword, 12);

        user = await db.user.create({
          data: {
            email: personalInfo.email,
            passwordHash: passwordHash,
            businessName: personalInfo.businessName || null,
            firstName: personalInfo.firstName,
            lastName: personalInfo.lastName,
            address: personalInfo.address,
            city: personalInfo.city,
            country: personalInfo.country,
            state: personalInfo.state,
            postcode: personalInfo.postcode,
            telephone: personalInfo.telephone
          }
        });
      }
    }

    // Process VpsInstance
    const vps = await db.vpsInstance.create({
      data: {
        userId: user.id,
        name: `Server-${Math.floor(Math.random() * 10000)}`,
        os: image,
        memory: "From Plan Specs", 
        vcpu: "From Plan Specs",
        disk: storageType || "NVMe",
        region: region,
        sshPassword: password, // The password from Step 1
        status: "pending_payment",
        nextPayment: new Date(new Date().setMonth(new Date().getMonth() + term)),
      }
    });

    // Create Order
    const order = await db.order.create({
      data: {
        userId: user.id,
        vpsInstanceId: vps.id,
        planId: planId,
        termMonths: term,
        amount: totalAmount,
        status: "unpaid",
        paymentMethod: "payoneer"
      }
    });

    return NextResponse.json({ success: true, orderId: order.id, accountPassword: generatedPassword });

  } catch (error: any) {
    console.error("Order completion failed:", error);
    return NextResponse.json({ error: error.message || "Failed to process order" }, { status: 500 });
  }
}
