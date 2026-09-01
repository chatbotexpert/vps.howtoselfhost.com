export const CONTABO_API_URL = "https://api.contabo.com/v1";
export const CONTABO_AUTH_URL = "https://auth.contabo.com/auth/realms/contabo/protocol/openid-connect/token";

export async function getContaboToken() {
  const isDryRun = process.env.CONTABO_CLIENT_ID === "placeholder_client_id";
  if (isDryRun) {
    console.log("[Contabo API Dry-Run] Returning mock auth token.");
    return "mock_contabo_token";
  }

  const params = new URLSearchParams();
  params.append("client_id", process.env.CONTABO_CLIENT_ID || "");
  params.append("client_secret", process.env.CONTABO_CLIENT_SECRET || "");
  params.append("grant_type", "password");
  params.append("username", process.env.CONTABO_API_USER || "");
  params.append("password", process.env.CONTABO_API_PASSWORD || "");

  try {
    const response = await fetch(CONTABO_AUTH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });

    if (!response.ok) {
      throw new Error("Failed to authenticate with Contabo API");
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Contabo Auth Error:", error);
    throw error;
  }
}

export async function createContaboInstance(params: {
  imageId: string;
  productId: string;
  regionId: string;
  sshKeys?: number[];
  userData?: string;
  rootPassword?: string;
}) {
  const isDryRun = process.env.CONTABO_CLIENT_ID === "placeholder_client_id";
  if (isDryRun) {
    console.log("[Contabo API Dry-Run] Mocking instance creation for:", params);
    return {
      instanceId: `mock_instance_${Date.now()}`,
      status: "provisioning",
    };
  }

  const token = await getContaboToken();

  try {
    const response = await fetch(`${CONTABO_API_URL}/compute/instances`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageId: params.imageId,
        productId: params.productId,
        regionId: params.regionId,
        sshKeys: params.sshKeys,
        userData: params.userData,
        rootPassword: params.rootPassword,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Contabo Create Instance Error:", errorData);
      throw new Error("Failed to create Contabo instance");
    }

    const data = await response.json();
    return {
      instanceId: data.data[0].instanceId,
      status: data.data[0].status,
    };
  } catch (error) {
    console.error("Contabo API Error:", error);
    throw error;
  }
}

export async function getContaboInstance(instanceId: string) {
  const isDryRun = process.env.CONTABO_CLIENT_ID === "placeholder_client_id";
  if (isDryRun) {
    console.log(`[Contabo API Dry-Run] Mocking instance fetch for ${instanceId}. Returning fake IP.`);
    return {
      status: "running",
      ip: "192.168.1.100",
    };
  }

  const token = await getContaboToken();

  try {
    const response = await fetch(`${CONTABO_API_URL}/compute/instances/${instanceId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch Contabo instance");
    }

    const data = await response.json();
    return {
      status: data.data[0].status,
      ip: data.data[0].ipConfig.v4.ip,
    };
  } catch (error) {
    console.error("Contabo API Error:", error);
    throw error;
  }
}

export async function updateContaboInstancePassword(instanceId: string, rootPassword: string) {
  const isDryRun = process.env.CONTABO_CLIENT_ID === "placeholder_client_id";
  if (isDryRun) {
    console.log(`[Contabo API Dry-Run] Mocking password reset for ${instanceId}`);
    return true;
  }

  const token = await getContaboToken();

  try {
    const response = await fetch(`${CONTABO_API_URL}/compute/instances/${instanceId}/actions/resetPassword`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rootPassword,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Contabo Reset Password Error:", errorData);
      throw new Error("Failed to reset password on Contabo");
    }

    return true;
  } catch (error) {
    console.error("Contabo API Error:", error);
    throw error;
  }
}

export async function cancelContaboInstance(instanceId: string) {
  const isDryRun = process.env.CONTABO_CLIENT_ID === "placeholder_client_id";
  if (isDryRun) {
    console.log(`[Contabo API Dry-Run] Mocking cancellation for ${instanceId}`);
    return true;
  }

  const token = await getContaboToken();

  try {
    const response = await fetch(`${CONTABO_API_URL}/compute/instances/${instanceId}/cancel`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Contabo Cancel Instance Error:", errorData);
      throw new Error("Failed to cancel Contabo instance");
    }

    return true;
  } catch (error) {
    console.error("Contabo API Error:", error);
    throw error;
  }
}
