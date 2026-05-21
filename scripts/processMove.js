const issueTitle = process.env.ISSUE_TITLE || "";
const issueBody = process.env.ISSUE_BODY || "";

let column = null;

const titleMatch = issueTitle.match(/connect4-move-(\d+)/i);
if (titleMatch) {
  column = Number(titleMatch[1]);
}

if (!column) {
  const bodyMatch = issueBody.match(/\b([1-7])\b/);
  if (bodyMatch) {
    column = Number(bodyMatch[1]);
  }
}

if (!column || column < 1 || column > 7) {
  throw new Error(`Could not determine a valid column from issue. Title: ${issueTitle} Body: ${issueBody}`);
}
