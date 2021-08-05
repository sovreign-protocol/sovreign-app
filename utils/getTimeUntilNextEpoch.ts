import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(utc);
dayjs.extend(relativeTime);

export default function getTimeUntilNextEpoch(epochStart: number) {
  const epochStartTime = dayjs.unix(epochStart);

  const oneWeekFromEpochStart = epochStartTime.add(1, "week");

  const nowInUTC = dayjs.utc();

  if (oneWeekFromEpochStart.isAfter(nowInUTC)) {
    return `Next epoch ${oneWeekFromEpochStart.from(nowInUTC)}`;
  }

  return "Epoch passed, awaiting next epoch starting";
}
