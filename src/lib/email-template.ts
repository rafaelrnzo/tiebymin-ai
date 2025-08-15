import { UserData, AllTips } from "@/types";

interface EmailTemplateData {
  userData: UserData;
  tips: AllTips;
}

export const createAnalysisEmailTemplate = ({
  userData,
  tips,
}: EmailTemplateData) => {
  const userName =
    typeof window !== "undefined"
      ? localStorage.getItem("firstName") || userData.name
      : userData.name;
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 20px auto; background-color: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .header { background-color: #FFC6C6; padding: 30px; text-align: center; color: #333; }
        .header h1 { margin: 0; font-size: 28px; }
        .content { padding: 30px; }
        .section-title { font-size: 22px; color: #EF789B; margin-top: 25px; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
        .info-item { margin-bottom: 10px; }
        .info-item strong { color: #555; }
        .tips-list { list-style: disc; margin-left: 20px; padding-left: 0; }
        .tips-list li { margin-bottom: 5px; }
        .footer { background-color: #f2f2f2; padding: 20px; text-align: center; font-size: 12px; color: #777; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Your Personalized Style Analysis from Tiebymin AI</h1>
        </div>
        <div class="content">
          <h2>Hello ${userName || "User"},</h2>
          <p>Thank you for using Tiebymin AI! Here's a summary of your personalized style analysis and recommendations:</p>

          <h3 class="section-title">Your Key Analysis Results</h3>
          <div class="info-item"><strong>Face Shape:</strong> ${userData.faceShape}</div>
          <div class="info-item"><strong>Body Shape:</strong> ${userData.bodyShape}</div>
          <div class="info-item"><strong>Color Tone:</strong> ${userData.colorTone}</div>
          <div class="info-item"><strong>BMI:</strong> ${userData.bmi.value} (${userData.bmi.category})</div>
          <div class="info-item"><strong>Celebrity Match:</strong> ${userData.celebrityMatch.name} (${userData.celebrityMatch.matchPercentage}% Match)</div>
          <div class="info-item"><strong>Celebrity Match Reason:</strong> ${userData.celebrityMatch.reason.join(", ")}</div>

          <h3 class="section-title">Detailed Recommendations</h3>

          <h4>Face Shape Tips:</h4>
          <ul class="tips-list">
            <li>${tips.faceTip}</li>
          </ul>

          <h4>Body Shape Tips:</h4>
          <ul class="tips-list">
            <li>${tips.bodyTip}</li>
          </ul>

          <h4>Color Tone Tips:</h4>
          <ul class="tips-list">
            <li><strong>Best Colors:</strong> ${userData.colorToneAnalysis.bestColors.join(", ")}</li>
            <li><strong>Neutral Colors:</strong> ${userData.colorToneAnalysis.neutralColors.join(", ")}</li>
            <li><strong>Worst Colors:</strong> ${userData.colorToneAnalysis.worstColors.join(", ")}</li>
            <li><strong>Combination Colors:</strong> ${userData.colorToneAnalysis.combination.join(", ")}</li>
            <li><strong>General Color Tip:</strong> ${tips.colorTip}</li>
          </ul>

          <h4>Makeup Tips:</h4>
          <ul class="tips-list">
            <li>${tips.makeupTip}</li>
          </ul>

          <h4>BMI Fashion Tips:</h4>
          <ul class="tips-list">
            <li>${tips.bmiTip}</li>
          </ul>

          <p>For a complete and detailed report, please download your personalized PDF from our website.</p>
          <p>Thank you for choosing Tiebymin AI to discover your unique style!</p>
        </div>
        <div class="footer">
          <p>&copy; 2025 Tiebymin AI. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
