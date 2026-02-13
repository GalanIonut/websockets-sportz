import { MATCH_STATUS } from "../validation/matches.js";

export function getMatchStatus(startTime, endTime, now = new Date()) {
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new Error("Invalid date format for startTime or endTime");
  }

  if (now < start) {
    return MATCH_STATUS.SCHEDULED;
  } else if (now >= start && now <= end) {
    return MATCH_STATUS.LIVE;
  } else {
    return MATCH_STATUS.FINISHED;
  }
}

export async function syncMatchStatus(match, updateStatus) {
  const nextStatus = getMatchStatus(match.startTime, match.endTime);

  if (!nextStatus) {
    throw new Error(
      "Unable to determine next status for match with id: " + match.id,
    );
  }

  if (match.status !== nextStatus) {
    await updateStatus(match.id, nextStatus);
    match.status = nextStatus; // Update the match object with the new status
  }

  return match.status;
}
