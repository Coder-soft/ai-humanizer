import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);

type HumanizationMode = 'subtle' | 'balanced' | 'strong' | 'stealth';

const prompts = {
  subtle: `Rewrite the following text to make it sound slightly more natural and conversational. Make only minor changes to improve flow and readability.

Original text:
"{{text}}"

Humanized text:`,
  balanced: `Rewrite the following text to make it sound more natural, conversational, and human-like. Fix any grammatical errors, improve the flow, and make it less robotic. Do not add any new information.

Original text:
"{{text}}"

Humanized text:`,
  strong: `Rewrite the following text to be much more casual, conversational, and engaging. Take creative liberties to make it sound like a real person wrote it, even if it means significantly changing the sentence structure and vocabulary.

Original text:
"{{text}}"

Humanized text:`,
  stealth: {
    step1: `Analyze the following text and extract the core ideas and key information into a list of bullet points. Do not rewrite or paraphrase, just extract the essential information.

Original text:
"{{text}}"

Core ideas:`,
    step2: `Write a new article from the following bullet points. The article should be well-structured, coherent, and engaging. It is crucial that you write in a style that has high perplexity and burstiness. This means you should vary sentence structure dramatically, mixing short, declarative sentences with longer, more complex ones. Use a natural, slightly informal tone, and incorporate contractions (like 'don't', 'isn't', 'it's') where they feel appropriate. Avoid overly formal or obscure words. The goal is to produce a text that is indistinguishable from human writing.

Core ideas:
"{{text}}"

New article:`,
  }
};

async function runPrompt(prompt: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

export async function POST(request: Request) {
  try {
    const { text, mode = 'balanced' } = await request.json() as { text: string; mode: HumanizationMode };

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    let humanizedText = '';

    if (mode === 'stealth') {
      const step1Prompt = prompts.stealth.step1.replace('{{text}}', text);
      const coreIdeas = await runPrompt(step1Prompt);

      const step2Prompt = prompts.stealth.step2.replace('{{text}}', coreIdeas);
      humanizedText = await runPrompt(step2Prompt);
    } else {
      const prompt = (prompts[mode] as string).replace('{{text}}', text);
      humanizedText = await runPrompt(prompt);
    }

    return NextResponse.json({ humanizedText });
  } catch (error) {
    console.error('Error in humanize API:', error);
    return NextResponse.json({ error: 'Failed to humanize text' }, { status: 500 });
  }
}
