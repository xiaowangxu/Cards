// Time
const formatTime = (date, withsecond = true) => {
	let year = date.getFullYear()
	let month = date.getMonth() + 1
	let day = date.getDate()
	let hour = date.getHours()
	let minute = date.getMinutes()
	let second = date.getSeconds()

	return [year, month, day].map(formatNumber).join('/') + ' ' + (withsecond ? [hour, minute, second] : [hour, minute]).map(formatNumber).join(':')
}

const formatTimeFiexdDate = date => {
	let hour = date.getHours()
	let minute = date.getMinutes()
	let second = date.getSeconds()
	return [2000, 1, 1].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatTimeOnly = (date, withsecond = false) => {
	let hour = date.getHours()
	let minute = date.getMinutes()
	let second = date.getSeconds()
	return (withsecond ? [hour, minute, second] : [hour, minute]).map(formatNumber).join(':')
}

const formatDate = (date, separator = '/') => {
	let year = date.getFullYear()
	let month = date.getMonth() + 1
	let day = date.getDate()
	return [year, month, day].map(formatNumber).join(separator)
}

const formatNumber = n => {
	n = n.toString()
	return n[1] ? n : '0' + n
}

const getTimeFiexdDate = date => {
	return new Date(formatTimeFiexdDate(date))
}

const getDay = date => {
	return date.getDay()
}

const CourseTime = [{
		start: new Date('2000/1/1 08:00:00'),
		end: new Date('2000/1/1 08:45:00')
	},
	{
		start: new Date('2000/1/1 08:55:00'),
		end: new Date('2000/1/1 09:40:00')
	},
	{
		start: new Date('2000/1/1 10:00:00'),
		end: new Date('2000/1/1 10:45:00')
	},
	{
		start: new Date('2000/1/1 10:55:00'),
		end: new Date('2000/1/1 11:40:00')
	},
	{
		start: new Date('2000/1/1 12:10:00'),
		end: new Date('2000/1/1 12:55:00')
	},
	{
		start: new Date('2000/1/1 13:05:00'),
		end: new Date('2000/1/1 13:50:00')
	},
	{
		start: new Date('2000/1/1 14:10:00'),
		end: new Date('2000/1/1 14:50:00')
	},
	{
		start: new Date('2000/1/1 15:05:00'),
		end: new Date('2000/1/1 15:50:00')
	},
	{
		start: new Date('2000/1/1 16:00:00'),
		end: new Date('2000/1/1 16:45:00')
	},
	{
		start: new Date('2000/1/1 16:55:00'),
		end: new Date('2000/1/1 17:40:00')
	},
	{
		start: new Date('2000/1/1 18:00:00'),
		end: new Date('2000/1/1 18:45:00')
	},
	{
		start: new Date('2000/1/1 18:55:00'),
		end: new Date('2000/1/1 19:40:00')
	},
	{
		start: new Date('2000/1/1 19:50:00'),
		end: new Date('2000/1/1 20:35:00')
	},
]

const getCourse = date => {
	let newdate = getTimeFiexdDate(date)
	// console.log(newdate.toString())
	for (let i = 0; i < CourseTime.length; i++) {
		let coursetime = CourseTime[i]
		if (newdate >= coursetime.start && newdate <= coursetime.end) {
			return i + 1
		}
	}
	return -1
}

const getCourseTime = coursetime => {
	if (coursetime < 1 || coursetime > 13) {
		return null
	} else {
		return CourseTime[coursetime - 1]
	}
}

const getCourseTimeFormated = coursetime => {
	if (coursetime < 1 || coursetime > 13) {
		return 'unknown - unknown'
	} else {
		let course = CourseTime[coursetime - 1]
		return formatTimeOnly(course.start) + ' - ' + formatTimeOnly(course.end)
	}
}

const getCourseTimeDuratiomFormated = (start, end) => {
	if (start < 1 || start > 13 || end < 1 || end > 13 || start >= end) {
		return 'unknown - unknown'
	} else {
		// console.log(start, end)
		return formatTimeOnly(CourseTime[start - 1].start) + ' - ' + formatTimeOnly(CourseTime[end - 1].end)
	}
}

// Cards
const getShareString = (card, collectionid = 0) => {
	let array = []
	switch (card.type) {
		case 'Todo':
			if (card.data.length <= 0) {
				break
			}
			let itemdata = []
			card.data.forEach((i) => {
				itemdata.push(i.text)
			})
			array = [
				0,
				new Date(card.start).getTime(),
				new Date(card.end).getTime(),
				card.week.map((item) => {
					return item ? 1 : 0
				}),
				itemdata
			]
			break
		case 'Collection':
			break
		case 'Passage':
			array = [
				2,
				new Date(card.start).getTime(),
				new Date(card.end).getTime(),
				card.week.map((item) => {
					return item ? 1 : 0
				}),
				card.data.title,
				card.data.passage
			]
			break
	}
	return {
		1: 'cards',
		2: [collectionid, array]
	}
}

const parseShareString = (str) => {
	let collectionid = str[0]
	let data = str[1]
	switch (data[0]) {
		case 2:
			let date = new Date()
			date.setTime(data[1])
			console.log(date)
			let start = formatTime(date, false)
			date.setTime(data[2])
			let end = formatTime(date, false)
			let week = data[3].map((item) => {
				return item === 1 ? true : false
			})
			let title = data[4]
			let passage = data[5]
			return {
				collectionid: collectionid, card: {
					type: 'Passage',
					start: start,
					end: end,
					week: week,
					data: {
						title: title,
						passage: passage,
						path: ''
					}
				}
			}
			default:
				break;
	}
}

const matchCard_Type = (card, type) => {
	return card.type === type
}

const matchCard_Data = (card, keyword) => {
	switch (card.type) {
		case 'Todo':
			for (let i = 0; i < card.data.length; i++) {
				let item = card.data[i]
				if (item.text.search(keyword) !== -1) {
					return true
				}
			}
			return false
			break
		case 'Collection':
			if (card.data.name.search(keyword) !== -1) {
				return true
			}
			return false
			break
		case 'Passage':
			if (card.data.title.search(keyword) !== -1 || card.data.passage.search(keyword) !== -1) {
				return true
			}
			return false
			break
	}
}

const searchCard = (card, keyword) => {
	let keywords = keyword.split(' ')
	let yes = false
	let style = 'or'
	if (keywords[0] === '&') {
		style = 'and'
		yes = true
	}
	for (let i = 0; i < keywords.length; i++) {
		let key = keywords[i]
		if (key === '' || key === '&') continue
		if (key[0] === '#') {
			let type = key.substr(1, key.length - 1)
			console.log(type.toLowerCase())
			switch (type.toLowerCase()) {
				case 'all':
					if (style === 'or') {
						return true
					}
					break
				case 'todo':
					if (style === 'or') {
						yes = yes || matchCard_Type(card, 'Todo')
					} else if (style === 'and') {
						yes = yes && matchCard_Type(card, 'Todo')
					}
					break
				case 'collection':
					if (style === 'or') {
						yes = yes || matchCard_Type(card, 'Collection')
					} else if (style === 'and') {
						yes = yes && matchCard_Type(card, 'Collection')
					}
					break
				case 'picture':
					if (style === 'or') {
						yes = yes || matchCard_Type(card, 'Picture')
					} else if (style === 'and') {
						yes = yes && matchCard_Type(card, 'Picture')
					}
					break
				case 'passage':
					if (style === 'or') {
						yes = yes || matchCard_Type(card, 'Passage')
					} else if (style === 'and') {
						yes = yes && matchCard_Type(card, 'Passage')
					}
					break
				default:
					yes = false
					break
			}
		} else {
			if (style === 'or') {
				yes = yes || matchCard_Data(card, key)
			} else if (style === 'and') {
				yes = yes && matchCard_Data(card, key)
			}
		}
	}
	return yes
}

module.exports = {
	formatTime: formatTime,
	formatTimeOnly: formatTimeOnly,
	formatDate: formatDate,
	getDay: getDay,
	getCourse: getCourse,
	getCourseTime: getCourseTime,
	getCourseTimeFormated: getCourseTimeFormated,
	getTimeFiexdDate: getTimeFiexdDate,
	getCourseTimeDuratiomFormated: getCourseTimeDuratiomFormated,
	getShareString: getShareString,
	parseShareString: parseShareString,
	searchCard: searchCard
}