# AI Humanizer External API

Welcome to the AI Humanizer External API! You can use this API to integrate our text humanization capabilities into your own applications.

## Getting Started

### 1. Get your API Key

To use the API, you'll need an API key. Please refer to the instructions provided to you to obtain your key.

### 2. Make your first request

Once you have your key, you can make a request to the `humanize` endpoint.

---

## API Reference

### `POST /api/external/humanize`

This endpoint takes a piece of text and humanizes it based on the selected mode.

#### Headers

-   `Authorization`: `Bearer YOUR_API_KEY` (Required)
-   `Content-Type`: `application/json`

#### Body

-   `text` (string, required): The text you want to humanize.
-   `mode` (string, optional, default: `balanced`): The humanization mode.
    -   `subtle`: Makes minor changes to improve flow and readability.
    -   `balanced`: Fixes grammar, improves flow, and makes the text sound more natural.
    -   `strong`: Takes creative liberties to make the text much more casual and engaging.
    -   `stealth`: A two-step process that first extracts core ideas and then rewrites them in a style with high perplexity and burstiness to appear more human-written.

#### Response

**Success (200 OK)**

```json
{
  "humanizedText": "This is the humanized version of your text."
}
```

**Error (400 Bad Request)**

```json
{
  "error": "Text is required"
}
```

**Error (401 Unauthorized)**

```json
{
  "error": "Unauthorized"
}
```

**Error (500 Internal Server Error)**

```json
{
  "error": "Failed to humanize text"
}
```

**Error (429 Too Many Requests)**

```json
{
  "error": "Too Many Requests"
}
```

---

## Rate Limiting

The API has a rate limit of 10 requests per minute per IP address. If you exceed this limit, you will receive a `429 Too Many Requests` error.

## Example

Here's an example of how to call the API using `curl`:

```bash
curl -X POST https://your-app-url.com/api/external/humanize \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "The aforementioned subject matter is of considerable importance.",
    "mode": "strong"
  }'
```
