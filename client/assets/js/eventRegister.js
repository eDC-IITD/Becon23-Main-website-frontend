// Base URL
// const base_url_3 = 'http://localhost:3000/'
const base_url_3 = 'https://becon.edciitd.com/';

var eventName;
var registerLink = 'No';

const getEventDetails = async () => {
    const getQuery = window.location.search
    eventName = getQuery.substring(1);
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    }
    const url = `${base_url_3}api/event/eventDetail/${eventName}`;
    try {
        await fetch(url, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.status === 200) {
                    if(data.event.registrationOpen===true){
                        document.getElementById('eventRegisterButton').disabled=false;
                        document.getElementById('eventRegisterButton').innerHTML="<span class='spinner-border text-light' role='status' id='eventRegisterLoader'></span><span>Register for event</span>";
                    }
                    document.getElementById('longName').innerText = data.event.longName;
                    document.getElementById('eventImage').src = data.event.image;
                    document.getElementById('eventDesc').innerText = data.event.desc;
                    document.getElementById('eventDate').innerText = data.event.date;
                    if (data.event.eventTimeline === '#') {
                        document.getElementById('eventTimelineContainer').style.display = 'none';
                    }
                    else {
                        document.getElementById('eventTimeline').href = data.event.eventTimeline
                        document.getElementById('eventTimeline').innerText="View";
                    }
                    document.getElementById('eventMode').innerText = data.event.mode;
                    document.getElementById('eventLocation').innerText = data.event.location;
                    if (data.event.externalRegistrationLink !== 'No') {
                        registerLink = data.event.externalRegistrationLink;
                    }
                }
                else {
                    console.log(data.message)
                }
            })
    }
    catch (error) {
        console.log(error)
    }
}

(function () {
    "use strict";
    getEventDetails()
})()

const registerEvent = async () => {
    if (localStorage.email === undefined) {
        swal({
            title: "Please login to register for event",
            text: `If don't have account please register `,
            icon: "info",
        });
    }
    else if (registerLink !== 'No') {
        window.open(registerLink, '_blank')
    }
    else {
        const eventRegisterLoader = document.getElementById('eventRegisterLoader');
        eventRegisterLoader.style.visibility = 'visible';
        const studentEmail = localStorage.email;
        const studentName = localStorage.name;
        const formData = {
            eventName: eventName,
            studentEmail: studentEmail,
            studentName: studentName
        }
        const requestOptions = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData)
        }
        const url = `${base_url_3}api/event/register`;
        try {
            await fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    console.log(data)
                    if (data.status === 200) {
                        eventRegisterLoader.style.visibility = 'hidden';
                        swal({
                            title: "Register successful",
                            text: data.message,
                            icon: "success",
                        })
                    }
                    else {
                        eventRegisterLoader.style.visibility = 'hidden';
                        swal({
                            title: "Something went wrong",
                            text: data.message,
                            icon: "info",
                        });
                    }
                })
        }
        catch (error) {
            eventRegisterLoader.style.visibility = 'hidden';
            console.log(error);
            swal({
                title: "Some Error occured",
                icon: "error",
            });
        }
    }
}