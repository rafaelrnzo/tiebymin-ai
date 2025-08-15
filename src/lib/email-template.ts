import { AnalysisData } from "@/types";

export const createAnalysisEmailTemplate = (analysisData: AnalysisData) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; }
        .header { background-color: #FFC6C6; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .footer { background-color: #f2f2f2; padding: 10px; text-align: center; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Your Tiebymin AI Analysis Results</h1>
      </div>
      <div class="content">
        <h2>Hi,</h2>
        <p>Here are your personalized analysis results:</p>
        <ul>
          <li><strong>Face Shape ID:</strong> ${
            analysisData.face_shape_id || "Not detected"
          }</li>
          <li><strong>Color Tone ID:</strong> ${
            analysisData.color_analysis_id || "Not detected"
          }</li>
          <li><strong>Body Shape ID:</strong> ${
            analysisData.body_shape_id || "Not detected"
          }</li>
          <li><strong>BMI:</strong> ${
            (analysisData.analysis_details?.bmi as { value: number })?.value ||
            "N/A"
          }</li>
          <li><strong>Celebrity Match:</strong> ${
            analysisData.celebrity?.name || "Not found"
          }</li>
        </ul>
        <h3>Recommendations:</h3>
        <p>Hasil analisamu sudah siap! Cek sekarang.</p>
      </div>
      <div class="footer">
        <p>Thank you for using Tiebymin AI.</p>
      </div>
    </body>
    </html>
  `;
};
