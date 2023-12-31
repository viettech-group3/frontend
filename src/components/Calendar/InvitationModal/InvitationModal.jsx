import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import styles from './InvitationModal.module.css';
import { useDispatch } from 'react-redux';
import { toggleInvitationModal } from '../../../slices/ShowInvitationModal';

const InvitationModal = () => {
  const exampleTokenForPhuoc = JSON.parse(localStorage.getItem('user')).token;
  // 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ODBiNTY1ZDhhMzVhNTViMDE2MTFmYiIsImlhdCI6MTY4NjE1NzQxOSwiZXhwIjoxNjg4NzQ5NDE5fQ.u2Xv7d9vm62wFiNQEJgq4Mak6LBBjpe9I69Dl4BH8eA';
  const [invitations, setInvitations] = useState([]);
  const dispatch = useDispatch();
  const modalRef = useRef(null);
  useEffect(() => {
    //Fetch Events of currentUser by getAllEvents() when we open <TodayModal/>
    axios
      .get('https://backend-ymqh.onrender.com/api/events/getPending', {
        headers: {
          Authorization: `Bearer ${exampleTokenForPhuoc}`,
        },
      })
      .then(response => {
        // Handle the response
        const fetchedEventsData = response.data;
        console.log(
          'Fetch successfully invitation',
          fetchedEventsData.invitedEvents,
        );
        setInvitations(response.data.invitedEvents);
      })
      .catch(error => {
        // Handle the error
        console.log(
          'There is an error when we try to fetch event for Invitation box',
        );
        console.error(error);
      });
  }, []); // Empty dependency array to run the effect only once on component mount

  const handleAcceptInvitation = eventId => {
    axios
      .put(
        `https://backend-ymqh.onrender.com/api/events/updateStatus/${eventId}`,
        { decision: 'accepted' },
        {
          headers: {
            Authorization: `Bearer ${exampleTokenForPhuoc}`,
          },
        },
      )
      .then(response => {
        // Handle the response
        console.log(response.data);
      })
      .catch(error => {
        // Handle the error
        console.log('There is an error when we try to Accept Invitation');
        console.error(error);
      });
  };

  const handleDenyInvitation = eventId => {
    axios
      .put(
        `https://backend-ymqh.onrender.com/api/events/updateStatus/${eventId}`,
        { decision: 'denied' },
        {
          headers: {
            Authorization: `Bearer ${exampleTokenForPhuoc}`,
          },
        },
      )
      .then(response => {
        // Handle the response
        console.log(response.data);
      })
      .catch(error => {
        // Handle the error
        console.log('There is an error when we try to Accept Invitation');
        console.error(error);
      });
  };

  const handleOutsideClick = event => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      dispatch(toggleInvitationModal());
    }
  };
  return (
    <div className={styles.overlay} onClick={handleOutsideClick}>
      <div className={styles.invitationModal} ref={modalRef}>
        <div
          className={styles.modalHeader}
          onClick={() => {
            dispatch(toggleInvitationModal());
          }}
        >
          X
        </div>
        <div>
          {invitations.map(invitation => (
            <div className={styles.eachInvitation}>
              <p>{invitation.creator}</p>
              <p>{invitation.name}</p>
              <p>{invitation.invitedBy}</p>
              <div>
                <button
                  onClick={() => {
                    handleAcceptInvitation(invitation._id);
                  }}
                  className="btn btn-primary"
                >
                  Accept
                </button>
                <button
                  onClick={() => {
                    handleDenyInvitation(invitation._id);
                  }}
                  className="btn btn-primary"
                >
                  Deny
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InvitationModal;
