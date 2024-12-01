from flask import Flask, request, jsonify
import requests
import json

app = Flask(__name__)

@app.route('/api/generate', methods=['POST'])
def generate():
    data = request.json
    prompt = data.get('prompt')

    if not prompt:
        return jsonify({"error": "No prompt provided"}), 400

    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "gemma2:2b",
                "prompt": prompt
            },
            stream=True  # Enable streaming
        )
        response.raise_for_status()

        # Initialize an empty string to store the complete response
        full_response = ""

        # Iterate through the streaming response
        for line in response.iter_lines():
            if line:
                try:
                    # Attempt to parse each line as JSON
                    json_response = json.loads(line)
                    if 'response' in json_response:
                        full_response += json_response['response']
                except json.JSONDecodeError:
                    # If a line can't be parsed as JSON, log it and continue
                    print(f"Warning: Could not parse line as JSON: {line}")

        return jsonify({"generated_text": full_response})

    except requests.RequestException as e:
        return jsonify({"error": f"Error communicating with Ollama API: {str(e)}"}), 500
    except json.JSONDecodeError as e:
        return jsonify({"error": f"Error parsing Ollama API response: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5328)

