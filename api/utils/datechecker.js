
exports.isNotPastDate = (date) => {
    const today = new Date();
    const due = new Date(date);


    today.setHours(23, 59, 59, 999);
    due.setHours(23, 59, 59, 999);

    return due >= today;
};
exports.calculateTaskPriority  = (due_date) => {

    const today = new Date();
    const due = new Date(due_date);


    today.setHours(23, 59, 59, 999);
    due.setHours(23, 59, 59, 999);

    const timeDiff = due.getTime() - today.getTime();
    const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return 0; 
    } else if (diffDays <= 2) {
        return 1; 
    } else if (diffDays <= 4) {
        return 2; 
    } else {
        return 3; 
    }
};
exports.isValidDate = (dateStr) => {
    const newDate = new Date(dateStr);
    return (
        !isNaN(newDate.getTime()) &&
        newDate.toISOString().slice(0, 10) === dateStr
    );
};
