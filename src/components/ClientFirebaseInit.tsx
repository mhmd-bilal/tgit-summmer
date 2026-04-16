"use client";

import { useEffect, useRef } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  getDocs,
  writeBatch,
  doc
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useStore, Team, Game, ScheduleItem } from "@/store/useStore";

export default function ClientFirebaseInit() {
  const setTeams = useStore((state) => state.setTeams);
  const setGames = useStore((state) => state.setGames);
  const setSchedule = useStore((state) => state.setSchedule);

  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    // Seed teams if empty
    const seedTeamsIfEmpty = async () => {
      const teamsRef = collection(db, "teams");
      const snapshot = await getDocs(teamsRef);

      if (!snapshot.empty) return;

      const teamsData = [
        {
          id: "team-1",
          name: "Bazinga",
          captain: "Karthik Ram",
          viceCaptain: "Nimit Sharma",
          members: [
            "Utkarsh Goyal",
            "Dhruv Garg",
            "Vipul Singh",
            "Arko Bose",
            "Maadhav Krishnamurthy",
            "Sruthi Elaprolu",
            "Subashree N",
            "Ayesha Isaac",
            "Sapura",
            "Somya Bansal",
            "Sanjay Sajeevan"
          ],
          score: 10
        },
        {
          id: "team-2",
          name: "Legendary Squad",
          captain: "Ruhi Mitra",
          viceCaptain: "Shivang Rai",
          members: [
            "Suryaa SV",
            "Aryan Kumar",
            "Vaishnavi Bharadwaj",
            "Anish K",
            "Harshini Gowrishankar",
            "Shania Job",
            "Manoj Chandrasekaran",
            "Rohan Pullela",
            "Akalya Muthanandam",
            "Aishwarya Kumar",
            "Somnath Amancherla"
          ],
          score: 30
        },
        {
          id: "team-3",
          name: "Lobster Gang",
          captain: "Anirudh Rishikesh Urs",
          viceCaptain: "Harshvardhan Dhatterwall",
          members: [
            "Mathan Sureshkumar",
            "Div Chaudhary",
            "Zainah Raheman Shaikh",
            "Darshan Deepak Katkar",
            "Nirmal Nair",
            "Roshini Gopalan",
            "Subash Devarajan",
            "Kushagra Jain",
            "Veena",
            "Ishaan Bhat",
            "Thendral M"
          ],
          score: 25
        },
        {
          id: "team-4",
          name: "Scranton Branch",
          captain: "Keegan Louis Moraes",
          viceCaptain: "Ayan Maity",
          members: [
            "Adarsana Gopalakrishnan",
            "Tharun Karthick A R K",
            "Soorya G",
            "Ananth Vishnubhotla",
            "Dhruti Bhat",
            "Satyam Bhattacharyya",
            "Bhavik Firke",
            "Pavan CH V L N",
            "Sinchana",
            "Dharani Chandran",
            "Binesh M"
          ],
          score: 45
        },
        {
          id: "team-5",
          name: "The Dunphy's",
          captain: "Malavika Dileep",
          viceCaptain: "Navkrut Rupesh Vaishya",
          members: [
            "Navin Kumar Lakshminaryanan",
            "Anuraag Mangesh Wange",
            "Varun Syam Mohan",
            "Bobby Prathikshana Murali Raj",
            "Ojas Shandilya",
            "Rohan Suratkal",
            "Lohith Munakala",
            "Rajyasri",
            "Pratyusha Rahul Garaye",
            "Ritika Satheesh",
            "Amol Datt"
          ],
          score: 70
        },
        {
          id: "team-6",
          name: "Charlie's Angels",
          captain: "Ayush Kumar",
          viceCaptain: "Siddharth Sharma",
          members: [
            "Sneha B A K",
            "Ayush Das",
            "Keshav Dahiya",
            "Dhamodaran Babu",
            "Kavin Madhavan",
            "Sai Karthik R",
            "Hrushika Chitloor",
            "Priyanka Y",
            "Deepthitha Ramamoorthy",
            "Sahil Tarun Agarwal"
          ],
          score: 5
        },
        {
          id: "team-7",
          name: "Cupcake Crew",
          captain: "Yeshaswini C V M",
          viceCaptain: "Pranav Jijo Panikulangara",
          members: [
            "Sowndarya Selvam",
            "Aarav Goel",
            "Vipransh Tyagi",
            "Arthi Saradha Natarajan",
            "Gokul Kumar S",
            "Suganth Thennarasu",
            "Unnamalai Narayanan",
            "Saikrupa P",
            "Anshul Roy",
            "Abhived Nair"
          ],
          score: 0
        },
        {
          id: "team-8",
          name: "99th Precinct",
          captain: "Kiran Seetharam",
          viceCaptain: "Himan Nayak",
          members: [
            "Arindham Srinivasan",
            "Mohammed Sohail Rafeeq",
            "Rishabh Dobhal",
            "Aprajita Bansal",
            "Pratik Dev",
            "Sanjeev Kumar Seenivasan",
            "Akshaya Sivanantham",
            "Chitra G",
            "Keerthana Devi Anandhraj",
            "Saishree Ramaswamy"
          ],
          score: 30
        }
      ];
      const batch = writeBatch(db);
      teamsData.forEach((team) => {
        const ref = doc(db, "teams", team.id);
        batch.set(ref, team);
      });

      await batch.commit();
      console.log("teams seeded successfully.");
    };

    seedTeamsIfEmpty();

    // Listen to teams ordered by score, then sort equal-score results locally to keep order stable
    const teamsQ = query(
      collection(db, "teams"),
      orderBy("score", "desc")
    );

    const unsubTeams = onSnapshot(
      teamsQ,
      (snapshot) => {
        const teamsData: Team[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        })) as Team[];
        teamsData.sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          return a.name.localeCompare(b.name);
        });
        setTeams(teamsData);
      },
      (error) => {
        console.error("Firebase Teams Subscription Error:", error);
      }
    );

    // Listen to games
    const unsubGames = onSnapshot(collection(db, "games"), (snapshot) => {
      const gamesData: Game[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as Game[];

      if (gamesData.length > 0) {
        setGames(gamesData);
      }
    });

    // Listen to schedule
    const scheduleQ = query(
      collection(db, "schedule"),
      orderBy("time", "asc")
    );

    const unsubSchedule = onSnapshot(scheduleQ, (snapshot) => {
      const scheduleData: ScheduleItem[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as ScheduleItem[];

      if (scheduleData.length > 0) {
        setSchedule(scheduleData);
      }
    });

    return () => {
      unsubTeams();
      unsubGames();
      unsubSchedule();
    };
  }, [setTeams, setGames, setSchedule]);

  return null;
}