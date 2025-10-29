import { type NextRequest, NextResponse } from "next/server";

// Temporary agent address from uAgent example - will be replaced with LuminYield Router Agent
const LUMINYIELD_ROUTER_AGENT_ADDRESS =
	"agent1qdhaqxdvjhtchfmra6ycwjt7p3dj7ucq2ccnx2ppk4pa5mde4kc0ghep43j";

let clientInstance: any = null;

async function getClient() {
	if (!clientInstance) {
		const UAgentClientModule = await import("uagent-client");
		const UAgentClient = UAgentClientModule.default || UAgentClientModule;

		clientInstance = new (UAgentClient as any)({
			timeout: 60000,
			autoStartBridge: true,
		});

		await new Promise((resolve) => setTimeout(resolve, 2000));
	}
	return clientInstance;
}

export async function POST(request: NextRequest) {
	try {
		const { message } = await request.json();

		if (!message || typeof message !== "string") {
			return NextResponse.json({ error: "Invalid message" }, { status: 400 });
		}

		const client = await getClient();
		const result = await client.query(LUMINYIELD_ROUTER_AGENT_ADDRESS, message);

		if (result.success) {
			return NextResponse.json({
				response: result.response,
				success: true,
			});
		} else {
			return NextResponse.json({
				response:
					"I apologize, but I was unable to process your yield optimization request at this time.",
				success: false,
				error: result.error,
			});
		}
	} catch (error) {
		return NextResponse.json(
			{
				response: "An error occurred while processing your request.",
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
