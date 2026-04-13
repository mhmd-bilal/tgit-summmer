import admin from "firebase-admin";

// Hardcoded service account credentials (temporary usage)
const serviceAccount = {
  "type": "service_account",
  "project_id": "tgit-summer-2026",
  "private_key_id": "YOUR_PRIVATE_KEY_ID",
  "private_key": "-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@tgit-summer-2026.iam.gserviceaccount.com",
  "client_id": "YOUR_CLIENT_ID",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40tgit-summer-2026.iam.gserviceaccount.com"
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: "tgit-summer-2026", // Explicitly specify the project ID
});

const db = admin.firestore();


const teams = [
  {
    "id": "team-1",
    "name": "Bazinga",
    "members": [
      "Nimit Sharma",
      "Karthik Ram",
      "Deepthitha Ramamoorthy",
      "Sowndarya Selvam",
      "Mohammed Sohail Rafeeq",
      "Arko Bose",
      "Ishaan Bhat",
      "Sahil Tarun Agarwal",
      "Suganth Thennarasu",
      "Ayesha Isaac",
      "Rajyasri"
    ],
    "score": 0
  },
  {
    "id": "team-2",
    "name": "Legendary Squad",
    "members": [
      "Malavika Dileep",
      "Ruhi Mitra",
      "Suryaa SV",
      "Dhruv Garg",
      "Vipul Singh",
      "Anish K",
      "Maadhav Krishnamurthy",
      "Pratik Dev",
      "Sanjeev Kumar Seenivasan",
      "Saishree Ramaswamy",
      "Priyanka Y"
    ],
    "score": 0
  },
  {
    "id": "team-3",
    "name": "Lobster Gang",
    "members": [
      "Shivang Rai",
      "Anirudh Rishikesh Urs",
      "Mathan Sureshkumar",
      "Aryan Kumar",
      "Vaishnavi Bharadwaj",
      "Darshan Deepak Katkar",
      "Dharani Chandran",
      "Sruthi Elaprolu",
      "Subashree N",
      "Unnamalai Narayanan",
      "Saikrupa P",
      "Veena"
    ],
    "score": 0
  },
  {
    "id": "team-4",
    "name": "Dunder Mifflin Crew",
    "members": [
      "Ayan Maity",
      "Keegan Louis Moraes",
      "Adarsana Gopalakrishnan",
      "Div Chaudhary",
      "Zainah Raheman Shaikh",
      "Ananth Vishnubhotla",
      "Harshini Gowrishankar",
      "Shania Job",
      "Manoj Chandrasekaran",
      "Rohan Pullela",
      "Sanjay Sajeevan"
    ],
    "score": 0
  },
  {
    "id": "team-5",
    "name": "Phil’s-osophy Clan",
    "members": [
      "Anshul Roy",
      "Pratyusha Rahul Garaye",
      "Navin Kumar Lakshminarayanan",
      "Tharun Karthick A R K",
      "Soorya G",
      "Bobby Prathikshana Murali Raj",
      "Nirmal Nair",
      "Roshini Gopalan",
      "Subash Devarajan",
      "Somnath Amancherla",
      "Chitra G"
    ],
    "score": 0
  },
  {
    "id": "team-6",
    "name": "Charlie’s Angels",
    "members": [
      "Navkrut Rupesh Vaishya",
      "Ayush Kumar",
      "Sneha B A K",
      "Anuraag Mangesh Wange",
      "Varun Syam Mohan",
      "Dhamodaran Babu",
      "Gokul Kumar S",
      "Satyam Bhattacharyya",
      "Bhavik Firke",
      "Thendral M",
      "Binesh M"
    ],
    "score": 0
  },
  {
    "id": "team-7",
    "name": "Cupcake Crew",
    "members": [
      "Siddharth Sharma",
      "Yeshaswini C V M",
      "Harshvardhan Dhatterwall",
      "Somya Bansal",
      "Keshav Dahiya",
      "Aishwarya Kumar",
      "Ojas Shandilya",
      "Rohan Suratkal",
      "Lohith Munakala",
      "Akshaya Sivanantham",
      "Sapura"
    ],
    "score": 0
  },
  {
    "id": "team-8",
    "name": "99th Precinct",
    "members": [
      "Pravan Jijo Panikulangara",
      "Kiran Seetharam",
      "Arindham Srinivasan",
      "Ayush Das",
      "Vipransh Tyagi",
      "Arthi Saradha Natarajan",
      "Kavin Madhavan",
      "Sai Karthik R",
      "Hrushika Chitloor",
      "Kushagra Jain",
      "Akalya Muthanandam",
      "Sinchana"
    ],
    "score": 0
  },
  {
    "id": "team-9",
    "name": "The Rose Family",
    "members": [
      "Himan Nayak",
      "Utkarsh Goyal",
      "Keerthana Devi Anandharaj",
      "Aarav Goel",
      "Rishabh Dobhal",
      "Aprajita Bansal",
      "Dhruthi Bhat",
      "Ritika Satheesh",
      "Abhived Nair",
      "Pavan CH V L N",
      "Amol Datt"
    ],
    "score": 0
  }
];

async function uploadTeams() {
  const batch = db.batch();

  teams.forEach((team) => {
    const ref = db.collection("teams").doc(team.id);
    batch.set(ref, team, { merge: true });
  });

  await batch.commit();
  console.log("Teams successfully uploaded/updated.");
}

uploadTeams().catch(console.error);