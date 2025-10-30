import { type NextRequest, NextResponse } from 'next/server'

// LuminYield Router Agent address (prefer env, fallback to known address)
const LUMINYIELD_ROUTER_AGENT_ADDRESS =
	process.env.NEXT_PUBLIC_ROUTER_AGENT_ADDRESS ||
	'agent1qtwtnak22nv2v4fary5yju4m0l3pny3xxqhldu3wfxu2umyghw6es2wsyfq'

let clientInstance: any = null

async function getClient() {
	if (!clientInstance) {
		const UAgentClientModule = await import('uagent-client')
		const UAgentClient = UAgentClientModule.default || UAgentClientModule

		clientInstance = new (UAgentClient as any)({
			timeout: 90000,
			autoStartBridge: true,
		})

		await new Promise((resolve) => setTimeout(resolve, 2000))
	}
	return clientInstance
}

export async function POST(request: NextRequest) {
	try {
		const { message } = await request.json()

		if (!message || typeof message !== 'string') {
			return NextResponse.json({ error: 'Invalid message' }, { status: 400 })
		}

		const client = await getClient()
		const result = await client.query(LUMINYIELD_ROUTER_AGENT_ADDRESS, message)

		if (result.success) {
			return NextResponse.json({
				response: result.response,
				success: true,
			})
		} else {
			return NextResponse.json({
				response:
					'I apologize, but I was unable to process your yield optimization request at this time.',
				success: false,
				error: result.error,
			})
		}
	} catch (error) {
		return NextResponse.json(
			{
				response: 'An error occurred while processing your request.',
				error: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 }
		)
	}
}
