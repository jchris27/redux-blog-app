import { parseISO, formatDistanceToNow } from "date-fns";

import React from 'react'

const TimeAgo = ({ timestamp }) => {
    let timeAgo = ''
    if (timestamp) {
        const date = parseISO(timestamp) // parse time to readable format
        const timePeriod = formatDistanceToNow(date) // format to distance
        timeAgo = `${timePeriod} ago`
    }

    return (
        <span title={timestamp}>
            &nbsp; <i>{timeAgo}</i>
        </span>
    )
}

export default TimeAgo