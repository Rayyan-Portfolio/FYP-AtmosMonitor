// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./SubPlan.css";

// const SubPlan = () => {
//   const navigate = useNavigate();

//   const [selectedPlan, setSelectedPlan] = useState(null);

//   const plans = [
//     {
//       id: 1,
//       name: "7-Day Free Trial",
//       description: "Enjoy the premium features for 7 days, completely free!",
//       price: "₨ 0.00",
//       duration: "7 days",
//       features: {
//         "Login and Sign-Up": true,
//         "Manage Accounts": true,
//         "Monitor Environment": true,
//         "View Dashboard": true,
//         "Provide Recommendations": false,
//         "Manage Alerts": false,
//         "Integrate Smart Devices": false,
//       },
//     },
//     {
//       id: 2,
//       name: "Monthly Plan",
//       description: "Get access to premium features for one month.",
//       price: "₨ 25,000",
//       duration: "1 month",
//       features: {
//         "Login and Sign-Up": true,
//         "Manage Accounts": true,
//         "Monitor Environment": true,
//         "View Dashboard": true,
//         "Provide Recommendations": true,
//         "Manage Alerts": true,
//         "Integrate Smart Devices": false,
//       },
//     },
//     {
//       id: 3,
//       name: "Yearly Plan",
//       description: "Get access to premium features for one full year.",
//       price: "₨ 275,000",
//       duration: "1 year",
//       features: {
//         "Login and Sign-Up": true,
//         "Manage Accounts": true,
//         "Monitor Environment": true,
//         "View Dashboard": true,
//         "Provide Recommendations": true,
//         "Manage Alerts": true,
//         "Integrate Smart Devices": true,
//       },
//     },
//   ];

//   const handleBuySubscription = (planId) => {
//     const plan = plans.find((p) => p.id === planId); // Find the selected plan based on ID
//     setSelectedPlan(plan); // Store the selected plan in the state
//     navigate("/checkout", { state: { selectedPlan: plan } }); // Pass the selected plan data to Checkout page using state
//   };

//   return (
//     <>
//       <h2 className="subscription-header">Choose Your Subscription Plan</h2>
//       <div className="subscription-container">
//         {plans.map((plan) => (
//           <div key={plan.id} className="plan-card">
//             <div className="plan-header">
//               <h3>{plan.name}</h3>
//             </div>
//             <p className="plan-description">{plan.description}</p>
//             <div className="plan-price">
//               <h4>{plan.price}</h4>
//               <span className="plan-duration">{plan.duration}</span>
//             </div>

//             <div className="plan-features">
//               {Object.keys(plan.features).map((feature, index) => (
//                 <div key={index} className="feature-item">
//                   <span
//                     className={
//                       plan.features[feature]
//                         ? "feature-checked"
//                         : "feature-unchecked"
//                     }
//                   >
//                     {plan.features[feature] ? "✓" : "✘"}
//                   </span>
//                   <span>{feature}</span>
//                 </div>
//               ))}
//             </div>

//             <button
//               className="buy-button"
//               onClick={() => handleBuySubscription(plan.id)}
//             >
//               Get {plan.name}
//             </button>
//           </div>
//         ))}
//           </div>
//     </>
//   );
// };

// export default SubPlan;
