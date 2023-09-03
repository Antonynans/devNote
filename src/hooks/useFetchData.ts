import { useState, useEffect } from 'react';
import { UserData } from "../models/UserData";
import { Endpoints } from "../components/Endpoints";
import axios from 'axios';

export const useFetchUserData = (userDetails: { user: { _id: string; }; }) => {
  const [userData, setUserData] = useState<UserData | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios(
          `${Endpoints.getUsersById}/${userDetails.user?._id}`,
        );

        setUserData(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [userDetails.user?._id]);
  return { userData, setUserData };
}
