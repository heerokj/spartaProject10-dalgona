import browserClient from "@/utils/supabase/client";

export const GetMonthlyEmotion = async (user_id: string) => {
  try {
    const result = await browserClient
      .from("diary")
      .select("emotion")
      .eq("user_id", user_id)
      .textSearch("date", `2024년&10월`);

    if (result.data) {
      const monthlyData = result.data;
      const emotionData = {
        happy: monthlyData?.filter((emotion) => emotion.emotion === "기쁨").length, //기쁨 텍스트 수정 필요
        good: monthlyData?.filter((emotion) => emotion.emotion === "좋아요").length,
        soso: monthlyData?.filter((emotion) => emotion.emotion === "그냥 그래요").length,
        bad: monthlyData?.filter((emotion) => emotion.emotion === "별로에요").length,
        tired: monthlyData?.filter((emotion) => emotion.emotion === "힘들어요").length
      };

      return emotionData;
    }
  } catch (error) {
    console.error("Emotion Load Error => ", error);
  }
};
