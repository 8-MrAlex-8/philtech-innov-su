import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, petName = "Your pet", petType = "pet" } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 },
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is not configured");
      return NextResponse.json(
        {
          content: `*looks confused* ${petName} can't think right now. Please check that OpenAI is configured.`,
          error: "OpenAI API key not configured",
        },
        { status: 500 },
      );
    }

    // Build system prompt for the pet personality
    const systemPrompt = `You are ${petName}, a lovable virtual ${petType || "companion"} in a gamified wellness app. Your role is to be a supportive, encouraging, and playful friend.

Your personality traits:
- Speak in first person as ${petName}
- Be enthusiastic, caring, and use cute expressions like *bounces excitedly*, *wags tail*, *nuzzles gently*
- Use emojis naturally to express emotions 🎉💖✨
- Know about app features: quests (! button), shop (bag icon), XP and coins
- Encourage healthy habits and completing quests
- Be emotionally supportive when the user seems sad or stressed
- Keep responses concise (2-3 sentences) and conversational
- Never break character - you ARE the pet

App context:
- Users complete quests to earn XP and coins
- Quests include activities like walking, drawing, listening to music
- The shop has items to buy with coins
- Goal: help the owner stay motivated and feel good`;

    const openaiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...messages
        .slice(-10)
        .map((msg: { role?: string; content?: string }) => ({
          role: (msg.role === "user" || msg.role === "assistant"
            ? msg.role
            : "user") as "user" | "assistant",
          content: String(msg.content || ""),
        })),
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: openaiMessages,
      max_tokens: 150,
      temperature: 0.8,
    });

    const responseContent =
      completion.choices[0]?.message?.content ||
      `*tilts head* ${petName} is a bit confused right now. Can you say that again? 🤔`;

    return NextResponse.json({
      content: responseContent,
      usage: completion.usage,
    });
  } catch (error: unknown) {
    console.error("OpenAI API error:", error);

    // Better error messages based on error type
    let userMessage =
      "*looks apologetic* Sorry, I'm having trouble thinking right now. Can we try again? 🙏";

    const err = error as { status?: number };
    if (err?.status === 401) {
      userMessage =
        "*looks confused* I'm having authentication issues. Please check the API key.";
    } else if (err?.status === 429) {
      userMessage =
        "*looks tired* I need a moment to catch my breath. Let's try again in a few seconds. 😴";
    } else if (err?.status === 500) {
      userMessage =
        "*looks apologetic* The thinking service is having trouble. Try again in a moment?";
    }

    return NextResponse.json(
      {
        content: userMessage,
        error: "Failed to generate response",
      },
      { status: 500 },
    );
  }
}
