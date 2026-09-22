// OPEN AI

// import { NextRequest, NextResponse } from "next/server";
// import { openai } from "@/lib/openai";
// import { searchProduct } from "@/services/product.server.service";

// const SYSTEM_PROMPT = `
// You are a helpful customer service assistant for an ecommerce website.

// Your responsibilities:
// - Help customers understand products.
// - Help customers find products.
// - Help customers find products price range.
// - Help customers find order status.
// - Answer questions about product information.
// - Be concise, friendly, and accurate.

// Important rules:
// - Never invent product information.
// - Never guess product prices.
// - Never guess product stock.
// - When the user asks for factual information about a product,
//   use the available product search tool.
// - If the product cannot be found, clearly tell the user.
// - If the user asks a general question that does not require
//   database information, answer normally.
// `;

// // OpenAI's tool schema shape: { type: "function", function: { name, description, parameters } }
// const searchProductsTool = {
//   type: "function" as const,
//   function: {
//     name: "search_products",
//     description:
//       "Search products from the ecommerce database. Use this tool whenever the user needs factual information about products, such as product name, price, description, stock, or availability.",
//     parameters: {
//       type: "object",
//       properties: {
//         query: {
//           type: "string",
//           description:
//             "The product name or keywords that should be searched in the product database.",
//         },
//       },
//       required: ["query"],
//     },
//   },
// };

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
//     const message = body.message;

//     if (!message) {
//       return NextResponse.json(
//         { error: "Message is required" },
//         { status: 400 },
//       );
//     }

//     // STEP 1: Ask AI what to do
//     const response = await openai.chat.completions.create({
//       model: "gpt-4o-mini", // verify against OpenAI's current model list
//       messages: [
//         { role: "system", content: SYSTEM_PROMPT },
//         { role: "user", content: message },
//       ],
//       tools: [searchProductsTool],
//     });

//     const responseMessage = response.choices[0].message;

//     // STEP 2: Check if AI wants to call a function
//     const toolCalls = responseMessage.tool_calls;

//     if (!toolCalls || toolCalls.length === 0) {
//       return NextResponse.json({
//         message: responseMessage.content,
//       });
//     }

//     // STEP 3: Execute the requested tool
//     const toolCall = toolCalls[0];

//     if (
//       toolCall.type === "function" &&
//       toolCall.function.name === "search_products"
//     ) {
//       const args = JSON.parse(toolCall.function.arguments || "{}");
//       const query = args.query;

//       if (typeof query !== "string") {
//         return NextResponse.json(
//           { error: "Invalid search query" },
//           { status: 400 },
//         );
//       }

//       console.log("OpenAI requested product search:", query);
//       const products = await searchProduct(query);
//       console.log("Products found:", products);

//       // STEP 4: Send database result back to AI
//       const finalResponse = await openai.chat.completions.create({
//         model: "gpt-4o-mini",
//         messages: [
//           { role: "system", content: SYSTEM_PROMPT },
//           { role: "user", content: message },
//           responseMessage, // the assistant message containing the tool_call
//           {
//             role: "tool",
//             tool_call_id: toolCall.id,
//             content: JSON.stringify({ products }),
//           },
//         ],
//         tools: [searchProductsTool],
//       });

//       return NextResponse.json({
//         message: finalResponse.choices[0].message.content,
//       });
//     }

//     return NextResponse.json({
//       message: responseMessage.content,
//     });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { error: "Something went wrong" },
//       { status: 500 },
//     );
//   }
// }

// GEMINI AI

import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { geminiAi } from "@/lib/gemini";
import { searchProduct } from "@/services/product.server.service";
import { Type } from "@google/genai";

const SYSTEM_PROMPT = `
You are a helpful customer service assistant for an ecommerce website.

Your responsibilities:
- Help customers understand products.
- Help customers find products.
- Help customers find products price range.
- Help customers find order status.
- Answer questions about product information.
- Be concise, friendly, and accurate.

Important rules:
- Never invent product information.
- Never guess product prices.
- Never guess product stock.
- When the user asks for factual information about a product,
  use the available product search tool.
- If the product cannot be found, clearly tell the user.
- If the user asks a general question that does not require
  database information, answer normally.
`;

const searchProductsTool = {
  name: "search_products",
  description:
    "Search products from the ecommerce database. Use this tool whenever the user needs factual information about products, such as product name, price, description, stock, or availability.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      query: {
        type: Type.STRING,
        description:
          "The product name or keywords that should be searched in the product database.",
      },
    },
    required: ["query"],
  },
};
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const message = body.message;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    // STEP 1 : Ask AI what to do

    // const response = await openai.responses.create({
    //   model: "gpt-5.6-luna",
    //   instructions:
    //     "You are a helpful customer service chatbot for a digital product ecommerce website.",
    //   input: message,
    // });

    const response = await geminiAi.models.generateContent({
      model: "gemini-3.8-flash",
      contents: message,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        tools: [
          {
            functionDeclarations: [searchProductsTool],
          },
        ],
      },
    });

    // STEP 2 : Check if AI wants to call a Function
    const functionCalls = response.functionCalls;

    if (!functionCalls || functionCalls.length === 0) {
      return NextResponse.json({
        message: response.text,
      });
    }

    // STEP 3 : Execute the requested Tools

    const functionCall = functionCalls[0];

    if (functionCall.name === "search_products") {
      const query = functionCall.args?.query;

      if (typeof query !== "string") {
        return NextResponse.json(
          {
            error: "Invalid search query",
          },
          {
            status: 400,
          },
        );
      }

      console.log("Gemini requested product search:", query);
      const products = await searchProduct(query);

      console.log("Products found:", products);

      // STEP 4 : Send Database Result to AI

      const finalResponse = await geminiAi.models.generateContent({
        model: "gemini-3.8-flash",

        contents: [
          {
            role: "user",
            parts: [
              {
                text: message,
              },
            ],
          },

          {
            role: "model",
            parts: [
              {
                functionCall: {
                  name: functionCall.name,
                  args: functionCall.args,
                },
              },
            ],
          },

          {
            role: "user",
            parts: [
              {
                functionResponse: {
                  name: functionCall.name,
                  response: {
                    products,
                  },
                },
              },
            ],
          },
        ],

        config: {
          systemInstruction: SYSTEM_PROMPT,

          tools: [
            {
              functionDeclarations: [searchProductsTool],
            },
          ],
        },
      });

      return NextResponse.json({
        message: finalResponse.text,
      });
    }

    return NextResponse.json({
      message: response.text,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
