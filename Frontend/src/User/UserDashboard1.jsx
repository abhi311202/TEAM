import React, { useState, useEffect } from "react";
// import AdminUploadnewdoc from "./AdminUploadnewdoc";
// import DocumentsUploaded from "./DocumentsUploaded";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";

const UserDashboard1 = () => {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [activeSection, setActiveSection] = useState("MyProfile");
  const [profileData, setProfileData] = useState({});
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Hamburger menu state

  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showEditDetailsModal, setShowEditDetailsModal] = useState(false);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setSummary(null); // Clear previous summary if any
    }
  };
  const handleMenuOptionClick = (section) => {
    setActiveSection(section);
    setIsMobileMenuOpen(false); // Close menu on option click
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();


  // Handle drag & drop functionality
  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    handleFileUpload(event);
  };
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Simulate summarization process
  const handleSummarize = () => {
    if (file) {
      setSummary("This is a summarized version of the uploaded document.");
    }
  };

  // Handle summary download
  const handleDownloadSummary = () => {
    const element = document.createElement("a");
    const fileBlob = new Blob([summary], { type: "text/plain" });
    element.href = URL.createObjectURL(fileBlob);
    element.download = "summary.txt";
    document.body.appendChild(element);
    element.click();
  };

  const storedObjectString = localStorage.getItem("Users");
  const myObject = JSON.parse(storedObjectString);
  // Fetch profile data from database (simulated here)
  useEffect(() => {
    setProfileData({
      name: myObject.name,
      email: myObject.email,
      phone: myObject.phone,
      dob: myObject.dob,
      gender: myObject.gender,
      aadhaar: myObject.aadhaar,
      profession: myObject.profession,
      organisation: myObject.organisation,
      docUploaded: myObject.docUploaded,
      registeredDate: myObject.registeredDate,
    });
  }, []);

  // Handle file upload

  const renderChangePasswordModal = () => {
    const [day, month, year] = profileData.dob.split("/").map(Number);
    const originalDate = new Date(year, month - 1, day);

    const savePassword = async (data) => {
      // Save password in database (simulated here)
      const userdetails = {
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        dob: originalDate,
        gender: profileData.gender,
        aadhaar: profileData.aadhaar,
        profession: profileData.profession,
        organisation: profileData.organisation,
        currentpass: data.currentpass,
        newpassword: data.newpassword,
        confirmPassword: data.confirmpassword,
      };

      await axios
        .post("http://52.66.174.249:4001/user/changepassword", userdetails)
        .then((res) => {
          console.log(res.data);
          if (res.data) {
            setShowChangePasswordModal(false);
            window.location.reload();
            toast.success(res.data.message);
          }
        })
        .catch((err) => {
          if (err.response) {
            console.log(err);
            toast.error("Error: " + err.response.data.message);
          }
        });
    };
    return (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center dark:bg-[#222] dark:bg-black dark:text-white">
        <div className="bg-white rounded-lg p-6 w-96 shadow-lg dark:bg-black dark:text-white ">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 dark:text-white">
            Change Password
          </h2>
          <form
            onSubmit={handleSubmit(savePassword)}
            method="dialog"
            className="space-y-4 text-black"
          >
            <div className="mb-4">
              <label className="block text-gray-600 font-medium mb-1 dark:text-white">
                Current Password
                <input
                  type="password"
                  className="w-full p-2 border rounded-md dark:text-white dark:bg-[#222]"
                  placeholder="Enter current password"
                  {...register("currentpass", { required: true })}
                />
              </label>
              {errors.currentpass && (
                <span className="p-2 text-sm text-red-500">
                  This field is required
                </span>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 font-medium mb-1 dark:text-white">
                New Password
                <input
                  type="password"
                  className="w-full p-2 border rounded-md dark:bg-[#222]"
                  placeholder="Enter new password"
                  {...register("newpassword", { required: true })}
                />
              </label>
              {errors.newpassword && (
                <span className="p-2 text-sm text-red-500">
                  This field is required
                </span>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 font-medium mb-1 dark:text-white">
                Confirm Password
                <input
                  type="password"
                  className="w-full p-2 border rounded-md dark:text-white dark:bg-[#222]"
                  placeholder="Confirm new password"
                  {...register("confirmpassword", { required: true })}
                />
              </label>
              {errors.confirmpassword && (
                <span className="p-2 text-sm text-red-500">
                  This field is required
                </span>
              )}
            </div>
            <div className="flex justify-start gap-2">
              <button
                type="button"
                className="bg-red-500 text-white px-4 py-2 rounded-md"
                onClick={() => setShowChangePasswordModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-md"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderEditDetailsModal = () => {
    const editDetails = async (data) => {
      // Edit details in database (simulated here)
      const userdetails = {
        name: data.name,
        newemail: data.email,
        email: profileData.email,
        phone: data.phone,
        dob: data.dob,
        gender: data.gender,
        aadhaar: data.aadhaar,
        profession: data.profession,
        organisation: data.organisation,
        password: data.password,
      };

      await axios
        .post("http://52.66.174.249:4001/user/editdetails", userdetails)
        .then((res) => {
          if (res.data) {
            setShowEditDetailsModal(false);
            // let storedUser = localStorage.getItem("Admin");
            // storedUser = JSON.parse(storedUser);

            // Modify the object
            // storedUser.age = 31; // Update age
            // storedUser.name = "Jane Doe"; // Update name

            // Save the updated object back to localStorage
            // localStorage.setItem("Admin", JSON.stringify(storedUser));
            localStorage.setItem("Users", JSON.stringify(res.data.user));
            window.location.reload();
            toast.success(res.data.message);
          }
        })
        .catch((err) => {
          if (err.response) {
            console.log(err);
            toast.error("Error: " + err.response.data.message);
          }
        });
    };

    return (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
        <div
          className="bg-white rounded-lg p-8 w-full max-w-4xl shadow-lg overflow-y-auto dark:bg-black "
          style={{
            marginTop: "5rem",
            maxHeight: "calc(100vh - 10rem)", // Limit modal height
          }}
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 dark:text-white">
            Edit Details
          </h2>
          <form
            onSubmit={handleSubmit(editDetails)}
            method="dialog"
            className="space-y-4 text-black"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="mb-4">
                <label className="block text-gray-600 font-medium mb-1 dark:text-white">
                  Name:
                  <input
                    type="text"
                    className="w-full p-3 border rounded-md dark:text-white dark:bg-[#222]"
                    placeholder="Enter your name"
                    {...register("name", { required: true })}
                  />
                </label>
                {errors.name && (
                  <span className="p-2 text-sm text-red-500">
                    This field is required
                  </span>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-600 font-medium mb-1 dark:text-white">
                  Email:
                  <input
                    type="email"
                    className="w-full p-3 border rounded-md dark:text-white dark:bg-[#222]"
                    placeholder="Enter your email"
                    {...register("email", { required: true })}
                  />
                </label>
                {errors.email && (
                  <span className="p-2 text-sm text-red-500">
                    This field is required
                  </span>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-600 font-medium mb-1 dark:text-white dark:bg-[#222]">
                  Phone no:
                  <input
                    type="tel"
                    className="w-full p-3 border rounded-md dark:text-white dark:bg-[#222]"
                    placeholder="Enter your phone number"
                    {...register("phone", { required: true })}
                  />
                </label>
                {errors.phone && (
                  <span className="p-2 text-sm text-red-500">
                    This field is required
                  </span>
                )}
              </div>
              <div className="mb-4 dark:text-white">
                <label className="block text-gray-600 font-medium mb-1">
                  Date of Birth:
                  <input
                    type="date"
                    className="w-full p-3 border rounded-md dark:text-white dark:bg-[#222]"
                    placeholder="Enter DOB"
                    {...register("dob", { required: true })}
                  />
                </label>
                {errors.dob && (
                  <span className="p-2 text-sm text-red-500">
                    This field is required
                  </span>
                )}
              </div>

              
              <div className="mb-4 dark:text-white">
                <label className="block text-gray-600 font-medium mb-1 dark:text-white">
                  Organization:
                  <input
                    type="text"
                    className="w-full p-3 border rounded-md dark:bg-[#222] dark:text-white"
                    placeholder="Enter organization"
                    {...register("organisation", { required: true })}
                  />
                </label>
                {errors.organisation && (
                  <span className="p-2 text-sm text-red-500">
                    This field is required
                  </span>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-600 font-medium mb-1 dark:text-white">
                  Aadhaar Id:
                  <input
                    type="text"
                    className="w-full p-3 border rounded-md dark:text-white dark:bg-[#222]"
                    placeholder="Enter your Aadhaar ID"
                    {...register("aadhaar", {
                      required: true,
                      pattern: /^[0-9]{12}$/, // Validates exactly 12 digits
                    })}
                  />
                </label>
                {errors.aadhaar && (
                  <span className="p-2 text-sm text-red-500">
                    This field is required
                  </span>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-600 font-medium mb-1 dark:text-white">
                  Profession:
                </label>
                <select
                  className="w-full p-3 border rounded-md dark:text-white dark:bg-[#222]"
                  {...register("profession", { required: true })}
                >
                  <option disabled selected>
                    Select Profession
                  </option>
                  <option value="Lawyer">Lawyer</option>
                  <option value="Judge">Judge</option>
                  <option value="Student">Student</option>
                  <option value="Legal Researcher">Legal Researcher</option>
                </select>
                {errors.profession && (
                  <span className="p-2 text-sm text-red-500">
                    This field is required
                  </span>
                )}
              </div>
              <div className="mb-4 ">
                <label className="block text-gray-600 font-medium mb-1 dark:text-white" >
                  Password:
                  <input
                    type="password"
                    className="w-full p-3 border rounded-md dark:text-white dark:bg-[#222]"
                    placeholder="Enter your name"
                    {...register("password", { required: true })}
                  />
                </label>
                {errors.password && (
                  <span className="p-2 text-sm text-red-500">
                    This field is required
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-start gap-4 mt-6">
              <button
                type="button"
                className="bg-red-500 text-white px-6 py-3 rounded-md"
                onClick={() => setShowEditDetailsModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-3 rounded-md"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (activeSection === "MyProfile") {
      return (
        <div className="p-6 bg-white shadow-lg rounded-lg dark:bg-[#222] dark:text-stone-50">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4 dark:text-white">
            My Profile
          </h2>
          <div className="flex direction-row items-center gap-2 mb-4">
            {/* <div className="px-4 py-5 bg-green-500 rounded-lg">
              <h1 className="text-lg font-medium">
                No. of Document Uploaded :
              </h1>
              <span className="text-4xl font-medium">
                {profileData.docUploaded}
              </span>
            </div> */}
            <div className="px-4 py-5 bg-green-500 rounded-lg">
              <h1 className="text-lg font-medium">Registration Date : </h1>
              <span className="text-4xl font-medium">
                {profileData.registeredDate}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Name:</span>
              <span>{profileData.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Email:</span>
              <span>{profileData.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Phone:</span>
              <span>{profileData.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Date of Birth:</span>
              <span>{profileData.dob}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Gender:</span>
              <span>{profileData.gender}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Aadhaar ID:</span>
              <span>{profileData.aadhaar}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Profession:</span>
              <span>{profileData.profession}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Organization:</span>
              <span>{profileData.organisation}</span>
            </div>
            <button
              className="bg-blue-600 text-white font-medium px-5 py-2 rounded-md mr-4"
              onClick={() => setShowChangePasswordModal(true)}
            >
              Change Password
            </button>
            <button
              className="bg-green-600 text-white font-medium px-5 py-2 rounded-md"
              onClick={() => setShowEditDetailsModal(true)}
            >
              Edit Details
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col md:flex-row max-h-[630px] bg-gray-100 mt-[65px] dark:bg-[#222] dark:text-white">
  {/* Mobile Header */}
  <div className="flex md:hidden bg-black text-white py-4 px-4 justify-between items-center">
    <button
      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      className="text-white text-2xl"
    >
      ☰
    </button>
    {/* <h1 className="text-lg font-semibold">Admin Panel</h1> */}
  </div>

  {/* Sidebar for Desktop */}
  <div className="hidden md:flex w-64 bg-black text-white py-4 px-1 flex-col justify-between max-h-[630px]">
    <ul className="mt-1 space-y-1">
      <li
        className="py-3 px-2 cursor-pointer hover:bg-gray-700 rounded-md"
        onClick={() => setActiveSection("MyProfile")}
      >
        My Profile
      </li>
    </ul>

    <h1 className="text-center text-sm">
      &copy; Legal AI {new Date().getFullYear()}
    </h1>
  </div>

  {/* Mobile Sidebar */}
  <div
    className={`fixed top-[65px] w-full h-full z-50 bg-black transform ${
      isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
    } transition-transform duration-300 flex flex-col`}
  >
    <div className="flex justify-between items-center p-4 text-white">
      {/* <h1 className="text-lg font-semibold">Admin Panel</h1> */}
      <button
        onClick={() => setIsMobileMenuOpen(false)}
        className="text-white text-2xl"
      >
        ✖
      </button>
    </div>
    <ul className="mt-4 space-y-4 px-4 text-white">
      <li
        className="cursor-pointer py-2"
        onClick={() => {
          setActiveSection("MyProfile");
          setIsMobileMenuOpen(false);
        }}
      >
        My Profile
      </li>
    </ul>
  </div>

  {/* Content Area */}
  <div className="flex-1 min-h-[630px] overflow-y-auto dark:bg-[#222]">
    {/* Render Content */}
    {showChangePasswordModal && renderChangePasswordModal()}
    {showEditDetailsModal && renderEditDetailsModal()}
    {!showChangePasswordModal && !showEditDetailsModal && renderContent()}
  </div>
</div>

  );
};

export default UserDashboard1;
