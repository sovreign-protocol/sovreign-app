import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(utc);
dayjs.extend(relativeTime);

export default function getTimeUntilNextEpoch(epochStart: number) {
  const epochStartTime = dayjs(epochStart);

  const oneWeekFromEpochStart = epochStartTime.add(1, "week");

  const nowInUTC = dayjs.utc();

  return oneWeekFromEpochStart.from(nowInUTC);
}
