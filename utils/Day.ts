import Day from 'dayjs'
import 'dayjs/locale/ko'
import relativeTime from 'dayjs/plugin/relativeTime'
Day.extend(relativeTime)
Day.locale('ko')

export default Day