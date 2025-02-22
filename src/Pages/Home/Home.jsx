import axios from "axios";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { BsThreeDotsVertical } from "react-icons/bs";
export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("To-Do");
  const [menuOpen, setMenuOpen] = useState(null); // Track which task's menu is open



  // Fetch tasks
  const queryClient = useQueryClient();
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:5000/tasks");
      return response.data;
    },
  });

  // adding a new task
  const addTaskMutation = useMutation({
    mutationFn: async (newTask) => {
      await axios.post("http://localhost:5000/tasks", newTask);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]); // Refetch tasks after adding
      Swal.fire({
        position: "top-left",
        icon: "success",
        title: "Task Added Successfully!",
        showConfirmButton: false,
        timer: 1000,
      });
      refetch();
    },
  });

  // Function to handle adding a task
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      Swal.fire({
        position: "top-left",
        icon: "error",
        title: "Give your task a title!",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    const newTask = {
      title,
      description,
      timestamp: new Date().toISOString(),
      category,
    };

    addTaskMutation.mutate(newTask);
    setTitle("");
    setDescription("");
    setShowForm(false);
  };










  //deleting a task
  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId) => {
      await axios.delete(`http://localhost:5000/tasks/${taskId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]); // Refetch tasks after deletion
      Swal.fire({
        position: "top-left",
        icon: "success",
        title: "Task Deleted Successfully!",
        showConfirmButton: false,
        timer: 1000,
      });
    },
  });

  // Handle menu toggle
  const toggleMenu = (taskId) => {
    setMenuOpen(menuOpen === taskId ? null : taskId); // Toggle the menu
  };

  // Handle task deletion
  const handleDeleteTask = (taskId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTaskMutation.mutate(taskId);
      }
    });
  };

  if (isLoading)
    return <div className="text-center mt-10">Loading tasks...</div>;

  return (
    <div className="pt-6 max-w-[1320px] mx-auto min-h-[calc(80vh)]">
      <div className="flex gap-6 items-center">
        <h1 className="text-3xl">Welcome to Task Manager</h1>
        <button
          className="bg-purple-500 hover:bg-purple-800 cursor-pointer text-white rounded-md py-2 px-4"
          onClick={() => setShowForm(true)}
        >
          Add Task
        </button>
      </div>

      {/* Task Sections */}
      <div className="grid md:grid-cols-3 mt-6  mb-4 gap-6">
        {/* To-Do Section */}
        <div className="bg-purple-300 px-3 md:h-[675px] overflow-y-scroll">
          <div className="flex justify-center">
            <h3 className="text-xl text-purple-700 font-semibold pt-2 border-b-2 border-purple-600">
              To-Do
            </h3>
          </div>
          <div className="border-t w-full border-purple-700 mt-3"></div>

          {/* Task Form */}
          {showForm && (
            <div className="mt-4 p-4 border border-purple-500 rounded-lg">
              <h2 className="text-xl text-purple-600 font-semibold">
                Add New Task
              </h2>
              <input
                type="text"
                placeholder="Task Title (max 50 characters)"
                maxLength="50"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 mt-2 border border-purple-500 rounded-md"
                required
              />
              <textarea
                placeholder="Task Description (optional, max 200 characters)"
                maxLength="200"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 mt-2 border border-purple-500 rounded-md"
              ></textarea>
              <div className="flex gap-4 mt-4">
                <button
                  className="bg-purple-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-purple-700"
                  onClick={handleAddTask}
                >
                  Submit Task
                </button>
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-gray-700"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Display To-Do Tasks */}
          <div>
      {tasks
        .filter((task) => task.category === "To-Do")
        .map((task) => (
          <div
            key={task._id}
            className="flex justify-between mt-4 p-4 bg-purple-200 border border-purple-500 rounded-lg h-[150px] relative"
          >
            <div>
              <h2 className="text-xl text-purple-600 font-semibold">{task.title}</h2>
              <p className="text-purple-800">{task.description}</p>
            </div>

            {/* Dropdown three dot */}
            <div className="relative">
              <button
                className="bg-purple-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-purple-700"
                onClick={() => toggleMenu(task._id)}
              >
                <BsThreeDotsVertical />
              </button>

              {/* Dropdown Menu */}
              {menuOpen === task._id && (
                <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-md">
                  <button
                    className="w-full text-left cursor-pointer px-4 py-2 text-purple-600 hover:bg-purple-300"
                    onClick={() => handleEditTask(task._id)}
                  >
                    Edit
                  </button>
                  <button
                    className="w-full text-left cursor-pointer px-4 py-2 text-red-600 hover:bg-red-200"
                    onClick={() => handleDeleteTask(task._id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
    </div>
        </div>

        {/* In-Progress Section */}
        <div className="bg-orange-200 px-3">
          <div className="flex justify-center">
            <h3 className="text-xl text-orange-700 font-semibold pt-2 border-b-2 border-orange-600">
              In-Progress
            </h3>
          </div>
          <div className="border-t w-full border-orange-700 mt-3"></div>

          {/* Display In-Progress Tasks */}
          <div>
            {tasks
              .filter((task) => task.category === "In-Progress")
              .map((task) => (
                <div
                  key={task._id}
                  className="mt-4 flex justify-between p-4 border border-orange-500 rounded-lg"
                >
                  <div>
                    <h2 className="text-xl text-orange-600 font-semibold">
                      {task.title}
                    </h2>
                    <p className="text-orange-800">{task.description}</p>
                  </div>
                  <div>
                    <button className="bg-orange-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-orange-700">
                      <BsThreeDotsVertical />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Done Section */}
        <div className="bg-green-200 px-3">
          <div className="flex justify-center">
            <h3 className="text-xl font-semibold pt-2 border-b-2 border-green-600">
              Done
            </h3>
          </div>
          <div className="border-t w-full border-green-700 mt-3"></div>

          {/* Display Done Tasks */}
          <div>
            {tasks
              .filter((task) => task.category === "Done")
              .map((task) => (
                <div
                  key={task._id}
                  className="mt-4 flex justify-between p-4 border border-green-500 rounded-lg"
                >
                  <div>
                    <h2 className="text-xl text-green-600 font-semibold">
                      {task.title}
                    </h2>
                    <p className="text-green-800">{task.description}</p>
                  </div>
                  <div className="flex items-center flex-col">
                    <button className="bg-green-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-green-700">
                      <BsThreeDotsVertical />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
