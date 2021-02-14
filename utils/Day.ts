import Day from 'dayjs'
import 'dayjs/locale/ko'
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedFormat from 'dayjs/plugin/localizedFormat'

Day.extend(relativeTime)
Day.extend(localizedFormat)
Day.locale('ko')

export default Day
