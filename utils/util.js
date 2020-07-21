// Time
const formatTime = date => {
	let year = date.getFullYear()
	let month = date.getMonth() + 1
	let day = date.getDate()
	let hour = date.getHours()
	let minute = date.getMinutes()
	let second = date.getSeconds()

	return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
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
				card.data.title,
				card.data.passage
			]
			break
	}
	return [collectionid, array]
}

function toThousands(num) {
	return (num || "").replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
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
	toThousands:toThousands
}