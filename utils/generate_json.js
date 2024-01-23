import dotenv from "dotenv"
dotenv.config()

import OpenAI from 'openai'

const openai_key = process.env.OPENAI_API_KEY
const openai = new OpenAI({ apiKey: openai_key })

const receipt_model = `
{
    store: {
      name: '',
      address: '',
      city: '',
    },
    items: [
      {
        description: '',
        price: ,
        weigth_in_grams: ,
        milliliters: ,
        quantity: 
      }
    ],
    total: { amount: , currency: '' },
    date_time: ISO 8601
    }
}
`

async function generate_json(ocr_receipt) {
  const response = await openai.chat.completions.create({
    model: "gpt-4-1106-preview",
    response_format: { "type": "json_object" },
    messages: [
      { "role": "system", "content": `This is a receipt, try to extract as much data as possible from the description to be able to fill the data as much as possible. This is the json content i need: ${receipt_model}` },
      { "role": "user", "content": `This is the receipt you have to convert into json: ${ocr_receipt}` },
    ],
    temperature: 0,
  })

  console.log(`Tokens in total: ${response.usage.total_tokens}`)

  return response.choices[0].message.content;
}

export default generate_json