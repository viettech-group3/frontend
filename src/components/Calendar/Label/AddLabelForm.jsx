import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { set, add, remove, update } from '../../../slices/LabelSlice';
import { toggleLabelForm } from '../../../slices/ShowLabelForm';
import styles from './AddLabelForm.module.css';

const AddLabelForm = () => {
  const [formData, setFormData] = useState({ name: '', color: '' });
  const dispatch = useDispatch();
  const exampleTokenForPhuoc = JSON.parse(localStorage.getItem('user')).token;
  const modalRef = useRef(null);

  const handleOutsideClick = event => {
    /* When we click outside the modal form, it will toggle off the modal */
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      console.log('Click outside');
      dispatch(toggleLabelForm());
    }
  };

  const handleSubmit = async event => {
    event.preventDefault();
    dispatch(add(formData));
    dispatch(toggleLabelForm());
    try {
      const response = await axios
        .post(
          'https://backend-ymqh.onrender.com/api/users//addLabelList',
          formData,
          {
            headers: {
              Authorization: `Bearer ${exampleTokenForPhuoc}`,
            },
          },
        )
        .then(response => {
          console.log(
            'data that we receive after create new label',
            response.data,
          );
        });
    } catch (error) {
      console.log(
        'There is an error when we send axios post request to create label',
        error,
      );
    }
    //setFormData
  };

  const handleChange = event => {
    const { name, value } = event.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  return (
    <div className={styles.overlay} onClick={handleOutsideClick}>
      <div className={styles.labelForm} ref={modalRef}>
        <button
          className="btn btn-primary"
          onClick={() => {
            dispatch(toggleLabelForm());
          }}
        >
          X
        </button>
        <div className={styles.labelFormTitle}>Add Labels Form</div>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="nameInput">Name</label>
            <input
              type="text"
              id="nameInput"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="colorInput">Color</label>
            <input
              type="text"
              id="colorInput"
              name="color"
              value={formData.color}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Submit Label Form
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddLabelForm;
