import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Input } from '../components/ui/input.jsx';
import { Label } from '../components/ui/label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select.jsx';
import {
  Bus,
  User,
  MapPin,
  Camera,
  Download,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Upload,
  Shield,
  CreditCard,
} from 'lucide-react';
import QRCode from 'qrcode';
import ThemeToggle from '../components/ThemeToggle.jsx';

// Boarding/Dropping Points
const boardingPoints = [
  "Majestic Central",
  "Silk Board",
  "HSR Layout",
  "Agara",
  "Sarjapura",
  "Bellandur",
  "Marathahalli",
  "Mahadevapura",
  "Tin Factory",
  "K R Puram",
  "Hoskote",
  "Kolar",
  "Palamaner",
  "Kondapur",
  "Gachibowli",
  "Miyapur",
  "Nizampet",
  "Kphb Colony,hyderabad",
  "Kukatpally",
  "Ameerpet Road",
  "Erragadda",
  "SR Nagar",
  "Ameerpet",
  "Punjagutta",
  "Lakdikapul",
  "Dilsukhnagar",
  "Kothapet",
  "LB Nagar",
  "Vanasthalipuram",
  "Hayathnagar",
  "Gummidipoondi",
  "Red Hills",
  "Puzhal",
  "Retteri",
  "Anna Nagar",
  "Ashok Pillar",
  "Guindy",
  "Perungudi",
  "Thuraipakkam",
  "Navalur",
  "SIPCOT",
  "Siruseri",
  "Vijayawada",
  "Bengaluru",
  "Other",
  "Guntur",
  "Bangalore",
];

const operators = ["SVKDT", "Zing Bus", "Yolo Bus", "EmcomServ Express", "Royal Travels", "Phani", "Other"];
const busTypes = ["AC Sleeper", "Non-AC Sleeper", "AC Semi-Sleeper", "Non-AC Semi-Sleeper", "Volvo AC", "ac", "Other"];

// Generate seat numbers
const generateSeats = () => {
  const seats = [];
  for (let i = 1; i <= 37; i++) {
    seats.push(`UB${i}`);
    seats.push(`LB${i}`);
  }
  return seats.sort();
};

const seatNumbers = generateSeats();

const Booking = () => {
  const navigate = useNavigate();
  
  // Custom Navbar for Booking Page
  const BookingNavbar = () => (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-11/12 max-w-4xl">
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-full border-2 border-purple-200/70 dark:border-purple-700/70 px-4 sm:px-6 py-3 shadow-2xl hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <Bus className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800">
              EmcomServ
            </span>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <ThemeToggle className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400" />
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 border-2 border-purple-200 dark:border-purple-700 hover:border-purple-400 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-all duration-300 rounded-full px-2 sm:px-3 py-1 text-sm font-medium"
              data-testid="back-to-home-button"
            >
              <ArrowLeft className="w-4 h-4 sm:mr-1" />
              <span className="hidden sm:inline">Back</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );

  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    name: "",
    gender: "",
    otherGender: "",
    age: "",
    seatNumber: "",
    contactNumber: "",
    boardingPoint: "",
    otherBoardingPoint: "",
    droppingPoint: "",
    otherDroppingPoint: "",
    travelDate: "",
    travelTime: "",
    pnr: "",
    ticketId: "",
    operatorName: "",
    otherOperatorName: "",
    busType: "",
    otherBusType: "",
    fare: "",
    bags: "",
    photo: null,
  });
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isBookingComplete, setIsBookingComplete] = useState(false);
  const fileInputRef = useRef(null);

  const handleInputChange = (field, value) => {
    setBookingData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setBookingData((prev) => ({ ...prev, photo: file }));
    }
  };

  const generateQRCode = async (apiResponse) => {
    const qrData = {
      name: bookingData.name,
      pnr: bookingData.pnr,
      ticketId: bookingData.ticketId,
      seat: bookingData.seatNumber,
      boarding: bookingData.boardingPoint === "Other" ? bookingData.otherBoardingPoint : bookingData.boardingPoint,
      dropping: bookingData.droppingPoint === "Other" ? bookingData.otherDroppingPoint : bookingData.droppingPoint,
      date: bookingData.travelDate,
      time: bookingData.travelTime,
      operator: bookingData.operatorName === "Other" ? bookingData.otherOperatorName : bookingData.operatorName,
      busType: bookingData.busType === "Other" ? bookingData.otherBusType : bookingData.busType,
      fare: bookingData.fare,
      apiResponse: apiResponse // Include API response in QR code
    };

    try {
      const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(qrData), {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
      setQrCodeUrl(qrCodeDataUrl);
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  const downloadQRCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement("a");
      link.download = `ticket-${bookingData.pnr}.png`;
      link.href = qrCodeUrl;
      link.click();
    }
  };

  const handleBooking = async () => {
    // Prepare form data for API call
    const formData = new FormData();
    formData.append("id", "37"); // Updated to match response
    formData.append("ticketNumber", bookingData.ticketId);
    formData.append("passengerName", bookingData.name);
    formData.append("seatNumber", bookingData.seatNumber);
    formData.append("boardingPoint", bookingData.boardingPoint === "Other" ? bookingData.otherBoardingPoint : bookingData.boardingPoint);
    formData.append("droppingPoint", bookingData.droppingPoint === "Other" ? bookingData.otherDroppingPoint : bookingData.droppingPoint);
    formData.append("date", bookingData.travelDate);
    formData.append("time", bookingData.travelTime);
    formData.append("operatorName", bookingData.operatorName === "Other" ? bookingData.otherOperatorName : bookingData.operatorName);
    formData.append("ticketPrice", bookingData.fare);
    formData.append("phoneNumber", bookingData.contactNumber);
    formData.append("busType", bookingData.busType === "Other" ? bookingData.otherBusType : bookingData.busType);
    formData.append("pnr", bookingData.pnr);
    formData.append("age", bookingData.age);
    formData.append("gender", bookingData.gender === "Other" ? bookingData.otherGender : bookingData.gender);
    formData.append("totalBagsAllowed", bookingData.bags);
    formData.append("bagsCheckedIn", "0"); // Always set to 0
    if (bookingData.photo) {
      formData.append("photo", bookingData.photo);
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/passenger`, {
        method: "POST",
        body: formData,
      });

      let apiResponse;
      try {
        apiResponse = await response.json();
      } catch (jsonError) {
        console.error("Error parsing JSON response:", jsonError);
        apiResponse = { error: "Invalid JSON response from server" };
      }

      if (response.ok) {
        await generateQRCode(apiResponse);
        setIsBookingComplete(true);
      } else {
        console.error("API call failed:", apiResponse);
        await generateQRCode(apiResponse); // Include error response in QR code
        setIsBookingComplete(true);
      }
    } catch (error) {
      console.error("Error making API call:", error);
      const errorResponse = { error: String(error) };
      await generateQRCode(errorResponse); // Include error in QR code
      setIsBookingComplete(true);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const isStepValid = () => {
    const isPnrValid = /^\d{7}$/.test(bookingData.pnr); // Validate PNR as 7 digits
    switch (currentStep) {
      case 1:
        return (
          bookingData.name &&
          (bookingData.gender !== "Other" || bookingData.otherGender) &&
          bookingData.age &&
          bookingData.contactNumber
        );
      case 2:
        return (
          (bookingData.boardingPoint !== "Other" || bookingData.otherBoardingPoint) &&
          (bookingData.droppingPoint !== "Other" || bookingData.otherDroppingPoint) &&
          bookingData.travelDate &&
          bookingData.travelTime
        );
      case 3:
        return (
          bookingData.seatNumber &&
          (bookingData.operatorName !== "Other" || bookingData.otherOperatorName) &&
          (bookingData.busType !== "Other" || bookingData.otherBusType) &&
          bookingData.fare &&
          bookingData.bags &&
          bookingData.ticketId &&
          bookingData.pnr &&
          isPnrValid
        );
      case 4:
        return true;
      default:
        return false;
    }
  };

  if (isBookingComplete) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-foreground transition-colors duration-300">
        <BookingNavbar />
        <div className="pt-24 px-4">
          <div className="container mx-auto max-w-4xl">
            <Card className="bg-white dark:bg-gray-800 border-2 border-green-500/50 dark:border-green-400/50 rounded-xl overflow-hidden shadow-xl">
              <CardHeader className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">Booking Confirmed!</CardTitle>
                <p className="text-gray-600 dark:text-gray-300">Your ticket has been successfully booked</p>
              </CardHeader>

              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Ticket Details */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Ticket Details</h3>

                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">PNR:</span>
                        <span className="text-gray-800 dark:text-gray-200 font-semibold">{bookingData.pnr}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Ticket ID:</span>
                        <span className="text-gray-800 dark:text-gray-200 font-semibold">{bookingData.ticketId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Passenger:</span>
                        <span className="text-gray-800 dark:text-gray-200">{bookingData.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Seat:</span>
                        <span className="text-purple-600 dark:text-purple-400 font-semibold">{bookingData.seatNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Route:</span>
                        <span className="text-gray-800 dark:text-gray-200">
                          {(bookingData.boardingPoint === "Other" ? bookingData.otherBoardingPoint : bookingData.boardingPoint)} → 
                          {(bookingData.droppingPoint === "Other" ? bookingData.otherDroppingPoint : bookingData.droppingPoint)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Date & Time:</span>
                        <span className="text-gray-800 dark:text-gray-200">
                          {bookingData.travelDate} at {bookingData.travelTime}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Operator:</span>
                        <span className="text-gray-800 dark:text-gray-200">
                          {bookingData.operatorName === "Other" ? bookingData.otherOperatorName : bookingData.operatorName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Bus Type:</span>
                        <span className="text-gray-800 dark:text-gray-200">
                          {bookingData.busType === "Other" ? bookingData.otherBusType : bookingData.busType}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-gray-300 dark:border-gray-600 pt-4">
                        <span className="text-gray-600 dark:text-gray-400 text-lg">Total Fare:</span>
                        <span className="text-green-600 dark:text-green-400 font-bold text-xl">₹{bookingData.fare}</span>
                      </div>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Your Ticket QR Code</h3>
                    {qrCodeUrl && (
                      <div className="bg-white p-4 rounded-lg inline-block mb-4 shadow-lg">
                        <img src={qrCodeUrl} alt="Ticket QR Code" className="w-64 h-64" />
                      </div>
                    )}
                    <Button
                      onClick={downloadQRCode}
                      className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg py-3 font-semibold cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      data-testid="download-qr-button"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download QR Code
                    </Button>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Show this QR code at the boarding point</p>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <Button 
                    onClick={() => navigate('/')}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-full px-8 py-3 font-semibold cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    data-testid="book-another-button"
                  >
                    Book Another Ticket
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-foreground transition-colors duration-300">
      <BookingNavbar />
      <div className="pt-24 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 bg-clip-text text-transparent mb-4">
              Book Your Journey
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">Experience comfort and convenience with EmcomServ</p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold cursor-pointer transition-all duration-300 ${
                      currentStep >= step
                        ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg"
                        : "bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                    }`}
                    data-testid={`step-${step}`}
                  >
                    {step}
                  </div>
                  {step < 4 && (
                    <div
                      className={`w-16 h-1 mx-2 transition-all duration-300 ${
                        currentStep > step ? "bg-gradient-to-r from-purple-500 to-purple-600" : "bg-gray-300 dark:bg-gray-700"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Step {currentStep} of 4:{" "}
                  {currentStep === 1
                    ? "Personal Details"
                    : currentStep === 2
                      ? "Journey Details"
                      : currentStep === 3
                        ? "Booking Details"
                        : "Review & Payment"}
                </p>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <Card className="bg-white dark:bg-gray-800 border-2 border-purple-200 dark:border-purple-700 rounded-xl overflow-hidden shadow-xl">
            <CardContent className="p-8">
              {/* Step 1: Personal Details */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <User className="w-12 h-12 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Personal Details</h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        value={bookingData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-purple-500 dark:focus:border-purple-400"
                        placeholder="Enter your full name"
                        data-testid="name-input"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gender" className="text-gray-700 dark:text-gray-300">
                        Gender *
                      </Label>
                      <Select onValueChange={(value) => handleInputChange("gender", value)}>
                        <SelectTrigger 
                          className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 cursor-pointer"
                          data-testid="gender-select"
                        >
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                          <SelectItem value="male" className="text-gray-800 dark:text-gray-200">Male</SelectItem>
                          <SelectItem value="female" className="text-gray-800 dark:text-gray-200">Female</SelectItem>
                          <SelectItem value="other" className="text-gray-800 dark:text-gray-200">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {bookingData.gender === "other" && (
                        <Input
                          id="otherGender"
                          value={bookingData.otherGender}
                          onChange={(e) => handleInputChange("otherGender", e.target.value)}
                          className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-purple-500 dark:focus:border-purple-400 mt-2"
                          placeholder="Specify gender"
                          data-testid="other-gender-input"
                        />
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="age" className="text-gray-700 dark:text-gray-300">
                        Age *
                      </Label>
                      <Input
                        id="age"
                        type="number"
                        min="5"
                        max="99"
                        value={bookingData.age}
                        onChange={(e) => handleInputChange("age", e.target.value)}
                        className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-purple-500 dark:focus:border-purple-400"
                        placeholder="Enter age (5-99)"
                        data-testid="age-input"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact" className="text-gray-700 dark:text-gray-300">
                        Contact Number *
                      </Label>
                      <Input
                        id="contact"
                        value={bookingData.contactNumber}
                        onChange={(e) => handleInputChange("contactNumber", e.target.value)}
                        className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-purple-500 dark:focus:border-purple-400"
                        placeholder="+91 XXXXXXXXXX"
                        data-testid="contact-input"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="photo" className="text-gray-700 dark:text-gray-300">
                      Upload Photo
                    </Label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-purple-400 dark:hover:border-purple-500 transition-colors cursor-pointer bg-gray-50 dark:bg-gray-700/50">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        data-testid="photo-upload"
                      />
                      <Camera className="w-12 h-12 text-gray-500 dark:text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 dark:text-gray-400 mb-2">Click to upload passenger photo</p>
                      <Button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        data-testid="choose-photo-button"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Choose Photo
                      </Button>
                      {bookingData.photo && (
                        <p className="text-green-600 dark:text-green-400 mt-2" data-testid="photo-success">✓ Photo uploaded: {bookingData.photo.name}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Journey Details */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <MapPin className="w-12 h-12 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Journey Details</h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="boarding" className="text-gray-700 dark:text-gray-300">
                        Boarding Point *
                      </Label>
                      <Select onValueChange={(value) => handleInputChange("boardingPoint", value)}>
                        <SelectTrigger 
                          className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 cursor-pointer"
                          data-testid="boarding-select"
                        >
                          <SelectValue placeholder="Select boarding point" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 max-h-60">
                          {boardingPoints.map((point) => (
                            <SelectItem key={point} value={point} className="text-gray-800 dark:text-gray-200">
                              {point}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {bookingData.boardingPoint === "Other" && (
                        <Input
                          id="otherBoardingPoint"
                          value={bookingData.otherBoardingPoint}
                          onChange={(e) => handleInputChange("otherBoardingPoint", e.target.value)}
                          className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-purple-500 dark:focus:border-purple-400 mt-2"
                          placeholder="Specify boarding point"
                          data-testid="other-boarding-input"
                        />
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dropping" className="text-gray-700 dark:text-gray-300">
                        Dropping Point *
                      </Label>
                      <Select onValueChange={(value) => handleInputChange("droppingPoint", value)}>
                        <SelectTrigger 
                          className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 cursor-pointer"
                          data-testid="dropping-select"
                        >
                          <SelectValue placeholder="Select dropping point" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 max-h-60">
                          {boardingPoints.map((point) => (
                            <SelectItem key={point} value={point} className="text-gray-800 dark:text-gray-200">
                              {point}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {bookingData.droppingPoint === "Other" && (
                        <Input
                          id="otherDroppingPoint"
                          value={bookingData.otherDroppingPoint}
                          onChange={(e) => handleInputChange("otherDroppingPoint", e.target.value)}
                          className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-purple-500 dark:focus:border-purple-400 mt-2"
                          placeholder="Specify dropping point"
                          data-testid="other-dropping-input"
                        />
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date" className="text-gray-700 dark:text-gray-300">
                        Travel Date *
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        value={bookingData.travelDate}
                        onChange={(e) => handleInputChange("travelDate", e.target.value)}
                        className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-purple-500 dark:focus:border-purple-400 cursor-pointer"
                        min={new Date().toISOString().split("T")[0]}
                        data-testid="date-input"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="time" className="text-gray-700 dark:text-gray-300">
                        Travel Time *
                      </Label>
                      <Input
                        id="time"
                        type="time"
                        value={bookingData.travelTime}
                        onChange={(e) => handleInputChange("travelTime", e.target.value)}
                        className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-purple-500 dark:focus:border-purple-400 cursor-pointer"
                        data-testid="time-input"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Booking Details */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <Bus className="w-12 h-12 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Booking Details</h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="ticketId" className="text-gray-700 dark:text-gray-300">
                        Ticket Number *
                      </Label>
                      <Input
                        id="ticketId"
                        value={bookingData.ticketId}
                        onChange={(e) => handleInputChange("ticketId", e.target.value)}
                        className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-purple-500 dark:focus:border-purple-400"
                        placeholder="Enter ticket number (e.g., 112333)"
                        data-testid="ticket-id-input"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pnr" className="text-gray-700 dark:text-gray-300">
                        PNR *
                      </Label>
                      <Input
                        id="pnr"
                        value={bookingData.pnr}
                        onChange={(e) => handleInputChange("pnr", e.target.value)}
                        className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-purple-500 dark:focus:border-purple-400"
                        placeholder="Enter PNR (e.g., 9876655)"
                        data-testid="pnr-input"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="seat" className="text-gray-700 dark:text-gray-300">
                        Seat Number *
                      </Label>
                      <Select onValueChange={(value) => handleInputChange("seatNumber", value)}>
                        <SelectTrigger 
                          className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 cursor-pointer"
                          data-testid="seat-select"
                        >
                          <SelectValue placeholder="Select seat" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 max-h-60">
                          {seatNumbers.map((seat) => (
                            <SelectItem key={seat} value={seat} className="text-gray-800 dark:text-gray-200">
                              {seat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="operator" className="text-gray-700 dark:text-gray-300">
                        Operator *
                      </Label>
                      <Select onValueChange={(value) => handleInputChange("operatorName", value)}>
                        <SelectTrigger 
                          className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 cursor-pointer"
                          data-testid="operator-select"
                        >
                          <SelectValue placeholder="Select operator" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                          {operators.map((operator) => (
                            <SelectItem key={operator} value={operator} className="text-gray-800 dark:text-gray-200">
                              {operator}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {bookingData.operatorName === "Other" && (
                        <Input
                          id="otherOperatorName"
                          value={bookingData.otherOperatorName}
                          onChange={(e) => handleInputChange("otherOperatorName", e.target.value)}
                          className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-purple-500 dark:focus:border-purple-400 mt-2"
                          placeholder="Specify operator"
                          data-testid="other-operator-input"
                        />
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="busType" className="text-gray-700 dark:text-gray-300">
                        Bus Type *
                      </Label>
                      <Select onValueChange={(value) => handleInputChange("busType", value)}>
                        <SelectTrigger 
                          className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 cursor-pointer"
                          data-testid="bus-type-select"
                        >
                          <SelectValue placeholder="Select bus type" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                          {busTypes.map((type) => (
                            <SelectItem key={type} value={type} className="text-gray-800 dark:text-gray-200">
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {bookingData.busType === "Other" && (
                        <Input
                          id="otherBusType"
                          value={bookingData.otherBusType}
                          onChange={(e) => handleInputChange("otherBusType", e.target.value)}
                          className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-purple-500 dark:focus:border-purple-400 mt-2"
                          placeholder="Specify bus type"
                          data-testid="other-bus-type-input"
                        />
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fare" className="text-gray-700 dark:text-gray-300">
                        Fare (₹) *
                      </Label>
                      <Input
                        id="fare"
                        type="number"
                        value={bookingData.fare}
                        onChange={(e) => handleInputChange("fare", e.target.value)}
                        className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-purple-500 dark:focus:border-purple-400"
                        placeholder="Enter fare amount"
                        data-testid="fare-input"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bags" className="text-gray-700 dark:text-gray-300">
                        Number of Bags *
                      </Label>
                      <Select onValueChange={(value) => handleInputChange("bags", value)}>
                        <SelectTrigger 
                          className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 cursor-pointer"
                          data-testid="bags-select"
                        >
                          <SelectValue placeholder="Select bags" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                          {[0, 1, 2, 3, 4, 5].map((num) => (
                            <SelectItem key={num} value={num.toString()} className="text-gray-800 dark:text-gray-200">
                              {num} {num === 1 ? "Bag" : "Bags"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Review & Payment */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <CreditCard className="w-12 h-12 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Review & Confirm</h2>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Booking Summary</h3>

                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Name:</span>
                          <span className="text-gray-800 dark:text-gray-200">{bookingData.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Gender:</span>
                          <span className="text-gray-800 dark:text-gray-200">
                            {bookingData.gender === "other" ? bookingData.otherGender : bookingData.gender}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Age:</span>
                          <span className="text-gray-800 dark:text-gray-200">{bookingData.age}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Contact:</span>
                          <span className="text-gray-800 dark:text-gray-200">{bookingData.contactNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Ticket Number:</span>
                          <span className="text-gray-800 dark:text-gray-200">{bookingData.ticketId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">PNR:</span>
                          <span className="text-gray-800 dark:text-gray-200">{bookingData.pnr}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Route:</span>
                          <span className="text-gray-800 dark:text-gray-200">
                            {(bookingData.boardingPoint === "Other" ? bookingData.otherBoardingPoint : bookingData.boardingPoint)} → 
                            {(bookingData.droppingPoint === "Other" ? bookingData.otherDroppingPoint : bookingData.droppingPoint)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Date:</span>
                          <span className="text-gray-800 dark:text-gray-200">{bookingData.travelDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Time:</span>
                          <span className="text-gray-800 dark:text-gray-200">{bookingData.travelTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Operator:</span>
                          <span className="text-gray-800 dark:text-gray-200">
                            {bookingData.operatorName === "Other" ? bookingData.otherOperatorName : bookingData.operatorName}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Bus Type:</span>
                          <span className="text-gray-800 dark:text-gray-200">
                            {bookingData.busType === "Other" ? bookingData.otherBusType : bookingData.busType}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Seat:</span>
                          <span className="text-purple-600 dark:text-purple-400 font-semibold">{bookingData.seatNumber}</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-300 dark:border-gray-600 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Amount:</span>
                        <span className="text-2xl font-bold text-green-600 dark:text-green-400">₹{bookingData.fare}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-green-700 dark:text-green-400 font-semibold">Secure Payment</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">Your payment information is encrypted and secure</p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <Button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  variant="outline"
                  className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 bg-transparent cursor-pointer"
                  data-testid="prev-button"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                {currentStep < 4 ? (
                  <Button
                    onClick={nextStep}
                    disabled={!isStepValid()}
                    className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    data-testid="next-button"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleBooking}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    data-testid="confirm-booking-button"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirm Booking
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Booking;