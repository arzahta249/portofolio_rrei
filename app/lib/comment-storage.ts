import { Comment, starterComments } from "../data/portfolio";
import { readStorage } from "./portfolio-storage";

export const COMMENT_STORAGE_KEY = "harum-comments";

export function normalizeComment(comment: Comment): Comment {
  return {
    ...comment,
    emoji: comment.emoji || "love",
    audio: comment.audio || "",
  };
}

export function normalizeComments(comments: Comment[]) {
  return comments.map(normalizeComment);
}

export function readComments() {
  return normalizeComments(readStorage(COMMENT_STORAGE_KEY, starterComments));
}
