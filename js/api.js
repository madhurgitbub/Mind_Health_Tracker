/* ============================================================
   MindScore — api.js
   Responsible ONLY for talking to the FastAPI /predict endpoint.
   ============================================================ */

const MindScoreAPI = (() => {

  const ENDPOINT = "https://mind-health-tracker-1.onrender.com";
  const TIMEOUT_MS = 15000;

  /**
   * Coerce raw form values into the exact JSON shape the backend expects.
   */
  function buildPayload(values) {
    return {
      Age: Number(values.Age),
      Gender: values.Gender,
      Country: values.Country,
      Academic_Level: values.Academic_Level,
      Most_Used_Platform: values.Most_Used_Platform,
      Purpose_Of_Use: values.Purpose_Of_Use,
      Avg_Daily_Usage_Hours: Number(values.Avg_Daily_Usage_Hours),
      Daily_Unlocks: Number(values.Daily_Unlocks),
      Study_Hours: Number(values.Study_Hours),
      Physical_Activity_Hours: Number(values.Physical_Activity_Hours),
      Sleep_Hours_Per_Night: Number(values.Sleep_Hours_Per_Night),
      Stress_Level: values.Stress_Level,
    };
  }

  /**
   * POST the form values to /predict.
   * Resolves with { predicted_Mental_Health_Score: number }
   * Rejects with an Error carrying a human-readable `.message`.
   */
  async function predict(values) {
    const payload = buildPayload(values);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    let response;
    try {
      response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new Error('The prediction server took too long to respond. Please try again.');
      }
      throw new Error('Could not reach the prediction server. Is the FastAPI backend running on 127.0.0.1:8000?');
    }
    clearTimeout(timeoutId);

    if (!response.ok) {
      let detail = `Server responded with status ${response.status}.`;
      try {
        const errBody = await response.json();
        if (errBody && (errBody.detail || errBody.message)) {
          detail = errBody.detail || errBody.message;
        }
      } catch (e) { /* body wasn't JSON — keep default detail */ }
      throw new Error(detail);
    }

    let data;
    try {
      data = await response.json();
    } catch (err) {
      throw new Error('The server returned an unreadable response.');
    }

    if (typeof data.predicted_Mental_Health_Score !== 'number') {
      throw new Error('The server response did not include a valid score.');
    }

    return data;
  }

  return { predict, buildPayload, ENDPOINT };
})();
