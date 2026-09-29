const API_BASE_URL = "http://localhost:5000/api";

const getHeaders = (token) => {
  const headers = {
    "Content-Type": "application/json",
  };
  const authToken = token || localStorage.getItem("token");
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }
  return data;
};

export const api = {
  // Auth API
  auth: {
    login: async (credentials) => {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(credentials),
      });
      return handleResponse(res);
    },

    register: async (userData) => {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(userData),
      });
      return handleResponse(res);
    },

    registerRestaurant: async (partnerData) => {
      const res = await fetch(`${API_BASE_URL}/auth/restaurant/register`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(partnerData),
      });
      return handleResponse(res);
    },

    getMe: async () => {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "GET",
        headers: getHeaders(),
      });
      return handleResponse(res);
    },

    updateProfile: async (profileData) => {
      const res = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(profileData),
      });
      return handleResponse(res);
    },
  },

  // Restaurant API
  restaurants: {
    getAll: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE_URL}/restaurants${query ? `?${query}` : ""}`, {
        method: "GET",
        headers: getHeaders(),
      });
      return handleResponse(res);
    },

    getById: async (id) => {
      const res = await fetch(`${API_BASE_URL}/restaurants/${id}`, {
        method: "GET",
        headers: getHeaders(),
      });
      return handleResponse(res);
    },

    getMyRestaurant: async () => {
      const res = await fetch(`${API_BASE_URL}/restaurants/my-restaurant`, {
        method: "GET",
        headers: getHeaders(),
      });
      return handleResponse(res);
    },

    create: async (restaurantData) => {
      const res = await fetch(`${API_BASE_URL}/restaurants`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(restaurantData),
      });
      return handleResponse(res);
    },

    update: async (id, restaurantData) => {
      const res = await fetch(`${API_BASE_URL}/restaurants/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(restaurantData),
      });
      return handleResponse(res);
    },
  },

  // Menu/Food API
  food: {
    getMenu: async (restaurantId) => {
      const res = await fetch(`${API_BASE_URL}/food/restaurant/${restaurantId}`, {
        method: "GET",
        headers: getHeaders(),
      });
      return handleResponse(res);
    },

    add: async (foodData) => {
      const res = await fetch(`${API_BASE_URL}/food`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(foodData),
      });
      return handleResponse(res);
    },

    update: async (id, foodData) => {
      const res = await fetch(`${API_BASE_URL}/food/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(foodData),
      });
      return handleResponse(res);
    },

    delete: async (id) => {
      const res = await fetch(`${API_BASE_URL}/food/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      return handleResponse(res);
    },

    toggleAvailability: async (id) => {
      const res = await fetch(`${API_BASE_URL}/food/${id}/availability`, {
        method: "PATCH",
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Orders API
  orders: {
    create: async (orderData) => {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(orderData),
      });
      return handleResponse(res);
    },

    getMyOrders: async () => {
      const res = await fetch(`${API_BASE_URL}/orders/my-orders`, {
        method: "GET",
        headers: getHeaders(),
      });
      return handleResponse(res);
    },

    getRestaurantOrders: async () => {
      const res = await fetch(`${API_BASE_URL}/orders/restaurant`, {
        method: "GET",
        headers: getHeaders(),
      });
      return handleResponse(res);
    },

    getById: async (id) => {
      const res = await fetch(`${API_BASE_URL}/orders/${id}`, {
        method: "GET",
        headers: getHeaders(),
      });
      return handleResponse(res);
    },

    updateStatus: async (id, status) => {
      const res = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ status }),
      });
      return handleResponse(res);
    },
  },

  // Group Order API
  groupOrders: {
    createRoom: async (data) => {
      const res = await fetch(`${API_BASE_URL}/group-orders`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },

    getRoom: async (roomId) => {
      const res = await fetch(`${API_BASE_URL}/group-orders/${roomId}`, {
        method: "GET",
        headers: getHeaders(),
      });
      return handleResponse(res);
    },

    joinRoom: async (roomId) => {
      const res = await fetch(`${API_BASE_URL}/group-orders/${roomId}/join`, {
        method: "POST",
        headers: getHeaders(),
      });
      return handleResponse(res);
    },

    addMemberItem: async (roomId, foodItemId, quantity = 1) => {
      const res = await fetch(`${API_BASE_URL}/group-orders/${roomId}/items`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ foodItemId, quantity }),
      });
      return handleResponse(res);
    },

    removeMemberItem: async (roomId, itemId) => {
      const res = await fetch(`${API_BASE_URL}/group-orders/${roomId}/items/${itemId}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      return handleResponse(res);
    },

    updateMemberItem: async (roomId, itemId, quantity) => {
      const res = await fetch(`${API_BASE_URL}/group-orders/${roomId}/items/${itemId}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ quantity }),
      });
      return handleResponse(res);
    },

    toggleLockRoom: async (roomId) => {
      const res = await fetch(`${API_BASE_URL}/group-orders/${roomId}/lock`, {
        method: "PATCH",
        headers: getHeaders(),
      });
      return handleResponse(res);
    },

    confirmGroupOrder: async (roomId, deliveryAddress) => {
      const res = await fetch(`${API_BASE_URL}/group-orders/${roomId}/confirm`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ deliveryAddress }),
      });
      return handleResponse(res);
    },
  },

  // Admin API
admin: {
  getStats: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/stats`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getRestaurants: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/restaurants`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  deleteRestaurant: async (id) => {
    const res = await fetch(`${API_BASE_URL}/admin/restaurants/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  toggleRestaurantStatus: async (id, status) => {
    const res = await fetch(`${API_BASE_URL}/admin/restaurants/${id}/status`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ isAvailable: status }),
    });
    return handleResponse(res);
  },
  
    getUsers: async () => {
      const res = await fetch(`${API_BASE_URL}/admin/users`, {
        method: "GET",
        headers: getHeaders(),
      });
      return handleResponse(res);
    },

    deleteUser: async (id) => {
      const res = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      return handleResponse(res);
    },

    getRestaurants: async () => {
      const res = await fetch(`${API_BASE_URL}/admin/restaurants`, {
        method: "GET",
        headers: getHeaders(),
      });
      return handleResponse(res);
    },

    toggleRestaurantStatus: async (id, isAvailable) => {
      const res = await fetch(`${API_BASE_URL}/admin/restaurants/${id}/status`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ isAvailable }),
      });
      return handleResponse(res);
    },

    getOrders: async () => {
      const res = await fetch(`${API_BASE_URL}/orders/admin/all`, {
        method: "GET",
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
  },
};
