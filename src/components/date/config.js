const config = {
  startWeek: 1,
  format: {
    date: 'YYYY-MM-DD',
    month: 'YYYY-MM',
    year: 'YYYY',
    time: 'HH:mm',
    datetime: 'YYYY-MM-DD HH:mm',
    datehour: 'YYYY-MM-DD HH:mm',
    datetimesecond: 'YYYY-MM-DD HH:mm:ss'
  },
  shortcuts: {
    today: {
      title: '今天',
      value () {
        return new Date()
      }
    },
    yesterday: {
      title: '昨天',
      value () {
        const date = new Date()
        date.setTime(date.getTime() - (3600 * 1000 * 24))
        return date
      }
    }
  },
  datetimeOptions: {
    minuteStep: 5
  },
  daterangeOptions: {
    paramName: {
      start: 'start',
      end: 'end'
    }
  }
}
export default config
