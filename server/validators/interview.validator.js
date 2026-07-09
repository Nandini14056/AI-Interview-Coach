const { z } = require("zod");

const interviewSchema = z.object({
  role:
    z.string()
      .trim()
      .min(2, "Role is required"),
  difficulty:
    z.enum(["Easy", "Medium", "Hard"]),
  techStack:
    z.array(
      z.string()
        .trim()
        .min(1, "Tech stack cannot contain empty values")),
  interviewType:
    z.enum(["Role", "Resume", "Mixed"]),
  mode:
    z.enum(["Text", "Voice", "Video"]),
  resumeUrl: z
    .string()
    .trim()
    .optional()
})
  .refine((data) => {
    if (data.interviewType === "Resume") {
      return !!data.resumeUrl;
    }
    return true;
  },
    {
      message: "Resume URL is required for Resume interviews.",
      path: ["resumeUrl"],
    }
  );

module.exports = { interviewSchema };