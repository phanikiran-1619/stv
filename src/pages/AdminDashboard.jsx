import React, { useEffect, useState } from "react"
import {
  User,
  Bus,
  Users,
  UserCheck,
  Phone,
  MapPin,
  Clock,
  ChevronRight,
  ChevronDown,
  RefreshCw,
} from "lucide-react"
import Navbar from "../components/Navbar.jsx"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { useNavigate } from "react-router-dom"

const AdminDashboard = () => {
  const navigate = useNavigate()
  
  /* ---------- State ---------- */
  const [routes, setRoutes] = useState([])
  const [selectedRouteId, setSelectedRouteId] = useState("")
  const [assignments, setAssignments] = useState([])
  const [selectedBusId, setSelectedBusId] = useState("")

  const [passengers, setPassengers] = useState([])
  const [loading, setLoading] = useState(false)

  const [showPassengerList, setShowPassengerList] = useState(false)
  const [passengerFilter, setPassengerFilter] = useState("all")
  const [isExpanded, setIsExpanded] = useState(true)
  
  // State for logout dialog
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  /* ---------- Helpers ---------- */
  const token = () => localStorage.getItem("admintoken") || ""
  
  // Clear all data function
  const clearAllData = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      document.cookie.split(";").forEach((cookie) => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
        document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`;
      });
      console.clear();
      if (window.caches) {
        window.caches.keys().then(names => {
          names.forEach(name => {
            window.caches.delete(name);
          });
        });
      }
    } catch (error) {
      console.log('Data clearing error:', error);
    }
  };

  // Handle logout confirmation
  const handleLogoutConfirm = () => {
    clearAllData();
    setShowLogoutDialog(false);
    window.history.pushState(null, "", window.location.href);
    window.history.pushState(null, "", window.location.href);
    navigate("/login", { replace: true });
    window.onpopstate = () => {
      navigate("/login", { replace: true });
    };
  };

  // Handle logout cancel
  const handleLogoutCancel = () => {
    setShowLogoutDialog(false);
    window.history.pushState(null, "", window.location.href);
  };

  /* ---------- Check authentication ---------- */
  useEffect(() => {
    const adminToken = localStorage.getItem("admintoken")
    if (!adminToken) {
      navigate('/login', { replace: true })
      return
    }
  }, [navigate])

  /* ---------- Browser back button protection ---------- */
  useEffect(() => {
    const handlePopState = (event) => {
      event.preventDefault();
      
      const token = localStorage.getItem("admintoken");
      if (token) {
        setShowLogoutDialog(true);
        window.history.pushState(null, "", window.location.href);
      } else {
        navigate("/login", { replace: true });
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.history.pushState(null, "", window.location.href);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate])

  /* ---------- API Calls ---------- */
  useEffect(() => {
    const adminToken = localStorage.getItem("admintoken")
    if (!adminToken) return
    
    // Initial fetch: routes
    fetch(`${process.env.REACT_APP_API_BASE_URL1}/api/routes`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    })
      .then((r) => r.json())
      .then((data) => {
        // Ensure data is an array
        setRoutes(Array.isArray(data) ? data : [])
      })
      .catch((error) => {
        console.error("Error fetching routes:", error)
        setRoutes([])
      })
  }, [])

  useEffect(() => {
    const adminToken = localStorage.getItem("admintoken")
    if (!selectedRouteId || !adminToken) {
      setAssignments([])
      // Clear bus selection when route changes
      setSelectedBusId("")
      // Clear passengers data
      setPassengers([])
      setShowPassengerList(false)
      return
    }
    fetch(`${process.env.REACT_APP_API_BASE_URL1}/api/assignments/route/${selectedRouteId}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    })
      .then((r) => r.json())
      .then((data) => {
        // Ensure data is an array
        setAssignments(Array.isArray(data) ? data : [])
      })
      .catch((error) => {
        console.error("Error fetching assignments:", error)
        setAssignments([])
      })
  }, [selectedRouteId])

  useEffect(() => {
    const adminToken = localStorage.getItem("admintoken")
    if (!selectedBusId || !adminToken) {
      setPassengers([])
      setShowPassengerList(false)
      return
    }
    setLoading(true)
    fetch(`${process.env.REACT_APP_API_BASE_URL1}/api/v1/passenger/bus/${selectedBusId}/all-passengers`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    })
      .then((r) => r.json())
      .then((data) => {
        // Ensure data is an array
        setPassengers(Array.isArray(data) ? data : [])
      })
      .catch((error) => {
        console.error("Error fetching passengers:", error)
        setPassengers([])
      })
      .finally(() => setLoading(false))
  }, [selectedBusId])

  /* ---------- Handlers ---------- */
  const handleRouteChange = (routeId) => {
    setSelectedRouteId(routeId)
    // Clear bus selection when route changes
    setSelectedBusId("")
    // Clear passengers data when route changes
    setPassengers([])
    setShowPassengerList(false)
    // Reset passenger filter
    setPassengerFilter("all")
  }

  const handleBusChange = (busId) => {
    setSelectedBusId(busId)
    // Reset passenger list display and filter when bus changes
    setShowPassengerList(false)
    setPassengerFilter("all")
  }

  const handleSearch = () => {
    // everything is reactive via useEffect; nothing extra to do
    setShowPassengerList(false)
  }

  /* ---------- Filtering ---------- */
  const filteredPassengers = () => {
    switch (passengerFilter) {
      case "checked_in":
        return passengers.filter((p) => p.status === "CHECKED_IN")
      case "not_checked_in":
        return passengers.filter((p) => p.status === "NOT_CHECKED_IN")
      case "cancelled":
        return passengers.filter((p) => p.status === "CANCELLED")
      case "empty":
        return []
      default:
        return passengers
    }
  }

  const counts = {
    all: passengers.length,
    checked_in: passengers.filter((p) => p.status === "CHECKED_IN").length,
    not_checked_in: passengers.filter((p) => p.status === "NOT_CHECKED_IN").length,
    cancelled: passengers.filter((p) => p.status === "CANCELLED").length,
    empty: 0, // no seat-level info in passenger api
  }

  const statusColor = (status) => {
    switch (status) {
      case "CHECKED_IN":
        return "bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/50"
      case "NOT_CHECKED_IN":
        return "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/50"
      case "CANCELLED":
        return "bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/50"
      default:
        return "bg-gray-500/20 text-gray-600 dark:text-gray-400 border-gray-500/50"
    }
  }

  /* ---------- UI ---------- */
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-foreground transition-colors duration-300">
      <Navbar isAdmin={true} showBackButton={false} />
      
      {/* Logout Confirmation Dialog */}
      {showLogoutDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-red-200 dark:border-red-800 max-w-md w-full p-6 animate-in fade-in-0 zoom-in-95 duration-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                Logout Confirmation
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                You are about to logout and clear all data. All your session data will be cleared. Do you want to continue?
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleLogoutCancel}
                  className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-500"
                  data-testid="logout-cancel-button"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogoutConfirm}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  data-testid="logout-confirm-button"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <main className="container mx-auto pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Search card */}
          <Card className="mb-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-2 border-purple-200/70 dark:border-purple-700/70 shadow-2xl rounded-3xl overflow-hidden hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-700">
            <CardHeader
              className="cursor-pointer hover:bg-purple-50/50 dark:hover:bg-purple-950/30 transition-colors"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Bus className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 bg-clip-text text-transparent">
                    Admin Panel
                  </CardTitle>
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                ) : (
                  <ChevronRight className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                )}
              </div>
            </CardHeader>

            {isExpanded && (
              <CardContent className="space-y-6 px-8 pb-8">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Route select */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Routes</label>
                    <Select onValueChange={handleRouteChange} value={selectedRouteId}>
                      <SelectTrigger className="bg-white dark:bg-gray-700 border-2 border-purple-200 dark:border-purple-700 text-gray-900 dark:text-white rounded-xl h-12 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300">
                        <SelectValue placeholder="Select Route" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800 border-2 border-purple-200 dark:border-purple-700 rounded-xl shadow-xl">
                        {routes.map((r) => (
                          <SelectItem key={r.stvRouteId} value={r.stvRouteId} className="hover:bg-purple-50 dark:hover:bg-purple-950/30">
                            {r.routeName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Bus select */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Buses</label>
                    <Select
                      onValueChange={handleBusChange}
                      value={selectedBusId}
                      disabled={!selectedRouteId || assignments.length === 0}
                    >
                      <SelectTrigger className="bg-white dark:bg-gray-700 border-2 border-purple-200 dark:border-purple-700 text-gray-900 dark:text-white rounded-xl h-12 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 disabled:opacity-50">
                        <SelectValue placeholder="Select Bus" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800 border-2 border-purple-200 dark:border-purple-700 rounded-xl shadow-xl">
                        {Array.isArray(assignments) && assignments.length > 0 ? (
                          assignments.map((a) => (
                            <SelectItem key={a.id} value={a.busId} className="hover:bg-purple-50 dark:hover:bg-purple-950/30">
                              {a.busId} &nbsp; (model: {a.busmodel || "?"}, capacity: {a.busCapacity || "—"})
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-buses" disabled>
                            No buses available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Details cards */}
          {selectedBusId && Array.isArray(assignments) && assignments.length > 0 && (
            <div className="space-y-8">
              {/* Bus summary */}
              <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 dark:from-purple-500/20 dark:to-blue-500/20 border-2 border-purple-300/50 dark:border-purple-600/50 rounded-2xl shadow-xl backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{selectedBusId}</h2>
                      <p className="text-gray-700 dark:text-gray-300">
                        {routes.find((r) => r.stvRouteId === selectedRouteId)?.routeName}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <span>
                          <Clock className="w-4 h-4 inline mr-1" />
                          {assignments[0]?.time || "—"}
                        </span>
                        <Badge className="bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/50">{assignments[0]?.status}</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {passengers.length} / {assignments[0]?.busCapacity || "?"}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Passengers</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Driver / Attender / Bus cards */}
              {(() => {
                const a = assignments.find(a => a.busId === selectedBusId) || assignments[0]
                return (
                  <div className="grid md:grid-cols-3 gap-6">
                    <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-2 border-blue-200/70 dark:border-blue-700/70 rounded-2xl shadow-xl hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-500">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                          <User className="w-5 h-5" />
                          <span>Driver Details</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{a.driverName || a.driverId}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">ID: {a.driverId}</p>
                        </div>
                        {a.driverNumber && (
                          <div className="flex items-center text-gray-700 dark:text-gray-300">
                            <Phone className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                            {a.driverNumber}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-2 border-green-200/70 dark:border-green-700/70 rounded-2xl shadow-xl hover:border-green-300 dark:hover:border-green-600 transition-all duration-500">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                          <UserCheck className="w-5 h-5" />
                          <span>Attender Details</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{a.attenderName || a.attenderId}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">ID: {a.attenderId}</p>
                        </div>
                        {a.attenderNumber && (
                          <div className="flex items-center text-gray-700 dark:text-gray-300">
                            <Phone className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" />
                            {a.attenderNumber}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-2 border-purple-200/70 dark:border-purple-700/70 rounded-2xl shadow-xl hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-500">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2 text-purple-600 dark:text-purple-400">
                          <Bus className="w-5 h-5" />
                          <span>Bus Details</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Bus ID:</span>
                            <span className="text-gray-900 dark:text-white font-semibold">{a.busId}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Model:</span>
                            <span className="text-gray-900 dark:text-white">{a.busmodel || "—"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Capacity:</span>
                            <span className="text-gray-900 dark:text-white">{a.busCapacity || "—"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Total Bags:</span>
                            <span className="text-gray-900 dark:text-white">{a.totalBags || "—"}</span>
                          </div>
                        </div>
                        <Button
                          onClick={() => setShowPassengerList(!showPassengerList)}
                          className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                          <Users className="w-4 h-4 mr-2" />
                          {showPassengerList ? "Hide" : "Show"} Passenger List
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )
              })()}

              {/* Passenger list */}
              {showPassengerList && (
                <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-2 border-purple-200/70 dark:border-purple-700/70 shadow-2xl rounded-2xl overflow-hidden hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-700">
                  <CardHeader className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 dark:from-purple-500/20 dark:to-blue-500/20">
                    <CardTitle className="flex items-center space-x-2 text-purple-600 dark:text-purple-400">
                      <Users className="w-6 h-6" />
                      <span>Passenger List</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex flex-wrap gap-3 mb-6">
                      {(["all", "checked_in", "not_checked_in", "cancelled"]).map((f) => (
                        <Button
                          key={f}
                          variant={passengerFilter === f ? "default" : "outline"}
                          onClick={() => setPassengerFilter(f)}
                          className={`rounded-full capitalize transition-all duration-300 ${
                            passengerFilter === f
                              ? f === "checked_in"
                                ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:from-green-600 hover:to-green-700"
                                : f === "not_checked_in"
                                ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg hover:from-yellow-600 hover:to-yellow-700"
                                : f === "cancelled"
                                ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:from-red-600 hover:to-red-700"
                                : "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg hover:from-purple-600 hover:to-purple-700"
                              : "border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-950/30 hover:border-purple-300 dark:hover:border-purple-600"
                          }`}
                        >
                          {f.replace("_", " ")} ({counts[f]})
                        </Button>
                      ))}
                    </div>

                    {loading ? (
                      <div className="text-center py-8 text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2">
                        <RefreshCw className="w-5 h-5 animate-spin text-purple-500" />
                        Loading passengers...
                      </div>
                    ) : (
                      <>
                        <div className="overflow-x-auto rounded-xl border border-purple-200 dark:border-purple-700">
                          <table className="w-full">
                            <thead>
                              <tr className="bg-purple-50 dark:bg-purple-950/30 border-b border-purple-200 dark:border-purple-700">
                                <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">ID</th>
                                <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Name</th>
                                <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Pick Up / Drop</th>
                                <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Seat</th>
                                <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Phone</th>
                                <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Bags</th>
                                <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredPassengers().map((p, idx) => (
                                <tr
                                  key={p.id}
                                  className={`border-b border-gray-200 dark:border-gray-700 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 transition-colors duration-200 ${
                                    idx % 2 === 0 ? "bg-gray-50/50 dark:bg-gray-800/50" : ""
                                  }`}
                                >
                                  <td className="p-4 text-gray-900 dark:text-white">{p.id}</td>
                                  <td className="p-4 text-gray-900 dark:text-white font-medium">{p.passengerName}</td>
                                  <td className="p-4 text-gray-700 dark:text-gray-300">
                                    <MapPin className="w-4 h-4 inline mr-1 text-purple-500" />
                                    {p.boardingPoint} → {p.droppingPoint}
                                  </td>
                                  <td className="p-4 text-gray-900 dark:text-white">{p.seatNumber}</td>
                                  <td className="p-4 text-gray-700 dark:text-gray-300">
                                    <Phone className="w-4 h-4 inline mr-1 text-purple-500" />
                                    {p.phoneNumber}
                                  </td>
                                  <td className="p-4 text-gray-900 dark:text-white">
                                    {p.bagsCheckedIn}/{p.totalBagsAllowed}
                                  </td>
                                  <td className="p-4">
                                    <Badge variant="outline" className={`${statusColor(p.status)} border font-medium`}>
                                      {p.status.replace("_", " ")}
                                    </Badge>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        {filteredPassengers().length === 0 && (
                          <div className="text-center py-8 text-gray-600 dark:text-gray-400">No passengers found.</div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard