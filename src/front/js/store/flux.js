const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			],
			user: JSON.parse(localStorage.getItem("userLogged")) || "",  // Cargar el usuario desde localStorage			email: "",
			auth: !!localStorage.getItem("token"), // Verifica si hay un token para mantener la sesión activa
			userAccounts: [],
			detailAccounts:[],
		},
		actions: {
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			getMessage: async () => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello");
					const data = await resp.json();
					setStore({ message: data.message });
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error);
				}
			},

			changeColor: (index, color) => {
				const store = getStore();
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});
				setStore({ demo });
			},

			login: async (email, password) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/login`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ email, password }),
					});
					const result = await response.json();

					if (response.status === 200) {
						localStorage.setItem("token", result.access_token);
						setStore({ auth: true });
						await getActions().verifyToken();
						await getActions().getPrivate();
						await getActions().getUserLogged();
						await getActions().getAccountsUser();
						await getActions().getAccountsDetail();
					} else {
						setStore({ auth: false });
					}
				} catch (error) {
					console.error(error);
					setStore({ auth: false });
				}
			},

			getPrivate: async () => {
				let token = localStorage.getItem("token");
				if (!token) return;
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/protected`, {
						method: "GET",
						headers: { "Authorization": `Bearer ${token}` },
					});
					const result = await response.json();
					setStore({ email: result.logged_in_as })
				} catch (error) {
					console.error(error);
				}
			},

			verifyToken: async () => {
				let token = localStorage.getItem("token");
				if (!token) {
					setStore({ auth: false });
					return;
				}

				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/verify-token`, {
						method: "GET",
						headers: { "Authorization": `Bearer ${token}` },
					});
					const isAuthenticated = response.status === 200;

					if (getStore().auth !== isAuthenticated) {
						setStore({ auth: isAuthenticated });
					}
				} catch (error) {
					console.error(error);
					setStore({ auth: false });
				}
			},

			logout: () => {
				localStorage.removeItem("token");
				localStorage.removeItem("userLogged");
				setStore({ auth: false, user: "" });
			},
			getUserLogged: async () => {

				try {
					const userLogged = JSON.parse(localStorage.getItem("userLogged"));
					const store = getStore()
					if (userLogged === null && store.email !== undefined) {
						const response = await fetch(`${process.env.BACKEND_URL}/api/users`);
						const result = await response.json();
						const userLogged = await result.results.find(item => item.email === store.email);
						localStorage.setItem("userLogged", JSON.stringify(userLogged));
						setStore({ user: userLogged });
					} else {
						setStore({ user: userLogged })
					}
				} catch (error) {
					console.error(error);
				}
			},
			initializeStore: () => {
				const userLogged = JSON.parse(localStorage.getItem("userLogged"));
				const token = localStorage.getItem("token");

				if (userLogged) {
					setStore({ user: userLogged });
				}

				if (token) {
					setStore({ auth: true });
					getActions().verifyToken();
					getActions().getPrivate();
				}
			},

			// registro usuario form
			registerUser: async (formData) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/signup`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(formData)
					});
					const result = await response.json();
					console.log(result)

					if (response.status === 201) {
						return { success: true, message: "Successfully registered" };
					} else {
						return { success: false, message: result.msg || "Registration error. Please try again" };
					}
				} catch (error) {
					console.error("Failed to connect to the server", error);
					return { success: false, message: "Error en la conexión con el servidor." };
				}
				// fin registro usuario
			},
			getAccountsUser: async () => {
				const myHeaders = new Headers();
				myHeaders.append("Cookie", ".Tunnels.Relay.WebForwarding.Cookies=CfDJ8Cs4yarcs6pKkdu0hlKHsZtLJEdvHSwRXZt17-888_aVJrmBrvu6RtYBoKMpKm9sEC-AxXi3sRWKgbFwf-p4hj2-84XL-87bz_Y0G7zB8iX-0y0kE4onkjgxSurJ2xjcvjN5j0SznVQpWIrQcTHHpW6OV8NIiNT91dMN_DBpqn7Ku0inf13JGgK7eJyftdxiu-_vwQHTzVbsiQN30MKU5UG7jMXXLPbrbXHRtaabX2EnUEHxglQZieSfFmtvDEvoGq26C0ixTRdmpVddBdux-ENmx93bhGaMFMQoE6ieOHEM83IjYztMG5XWr9WXCNyA1uGfaxE2rWP9qtlcvPoOYfgN6ci_aqRSxMumE5s_yvdu62T4sRgFVhMGDTrKF4hsNtkxzk7-6yHbnQMbXGg1BrVNUA7nZp5aj6i7lp67WQpPN3HqPkM0hUFDodFluRq3WaibUehanTF0-ewI7h5X1LsMbv-lO1qi7d2QsYT2jxyfxqO17Iz9os0znyuhBTZk7naL3yyXiwLpwzk6yyLHiEotFHha8NPLbJ9qdLu_rKxVO8xQyG8xYErsUqSl-x9PArSo6oudhd59gqyVxuPsQSVcKz-trvEPExQEVUXHK8gYdpnK3HwpenhoR-GqCxXjWtG1qXiRC78se1u9qYaFloMPMnqfZjkeHQAN5y_f2-2PcaX76KvzDWCwqsuWuYk5mq4yJxc6vdF2w0A2oIpPJn-s9aIA-0G9zo2FneXGU6WH10y8G430F-E9YqNjfepj32J53HEfcQS5mcl_WV8V98etWQS7FserlTT__EW-eM1dI3UvVAHV5ptaSNhbqaI8OXBjfm0onnpmrN5QqBn3W9tQRO6q1A_H7UhRGVUb5IFb-TKC033oG4rYb__EwxNQ1rx3uaXqahbtxSDNnASci2j_jHRQOIp68krpmiZT_BTb80OYh8znnE-L-JdM25WYEoIi5WUKtjyl5P0Wi_-ZN8IkCqcCuruodh4wn9L5TjeyLeXYTcBN8ltxypEXbt6F5g");

				const requestOptions = {
					method: "GET",
					headers: myHeaders,
					redirect: "follow"
				};

				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/user/${getStore().user.id}/accounts`, requestOptions);
					const result = await response.json();
					setStore({ userAccounts: result.result });

				} catch (error) {
					console.error(error);

				};
			},
			debit: async (amout, accountId) => {

				const myHeaders = new Headers();
				myHeaders.append("Content-Type", "application/json");

				const raw = JSON.stringify({
					"amount": amout
				});

				const requestOptions = {
					method: "PUT",
					headers: myHeaders,
					body: raw,
					redirect: "follow"
				};

				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/accounts/${accountId}/debit`, requestOptions);
					const result = await response.json();
				} catch (error) {
					console.error(error);
				};
			},
			deposit: async (amout, accountId) => {
				const myHeaders = new Headers();
				myHeaders.append("Content-Type", "application/json");

				const raw = JSON.stringify({
					"amount": amout
				});

				const requestOptions = {
					method: "PUT",
					headers: myHeaders,
					body: raw,
					redirect: "follow"
				};

				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/accounts/${accountId}/deposit`, requestOptions);
					const result = await response.json();
				} catch (error) {
					console.error(error);
				};
			},
			getAccountsDetail: async () => {
				const myHeaders = new Headers();
				myHeaders.append("Cookie", ".Tunnels.Relay.WebForwarding.Cookies=CfDJ8Cs4yarcs6pKkdu0hlKHsZuR5ZcgQ2KTnWDNr3AUt8ybBx2u9D6V4wNy29qq0uvKyt0dEmrGGzWX4XiYfTpuTAnKnIIv9Ln23w-4vAGompckgCekREzckivfx1EFoIdA_AtlfZC_VbnLv9vgzTXZ6J6j0Di2KszNcr_soZxDjxwalD3Kt4nhLxxrSE_36qp-s6R7bRAfnfsIM2JBE5HftxL7unD6bUCWegqmIaXAb4JCjVtFJZNT1RoiDzvsZJNVHF6FHsyBtcLNb5CwUMf1GC_A06IGE0OaLbfaZ1CeGVbdQPtviNt_zvkPlfWZfM8-g1mepf4HIM_UaH1whZxYKiQgPvpBRb5-T_4FFOSba0d8VRwHK_VMicGi3ju5BqujVmLHBnJ98EjagWnxF9g8PCi_JuLb3N2yVvgFuw0T5m17lX_5_BHBjJD4laB6jRX1Qbhi_Yiuolg2-48UKfr_cgFlzx3MUCJcQdlQeNOX2LYEgRjDbHwACpZTTG6R32om-lrBu4TBD073sxXitNjFT98geeeONMbTuhEGgyql-qzfTYqWLeuAt062SQuuOpUCHMw7pdbO1vZVcLV3dg-Sd8l0XFINELsMYGmh5YSVmzHttBNXZj2G8Nx51HVlrHVH6lWegB6znFO_KKsWK1jW-kkrXmstr88RphGCYQhZVAzoI8ag4ddz0JMZYgB6wDPIVeTIVAcy57sDfPekzK_cIKNKTEs7yRCREiUT36s-xTqghLmXXgUyLMs_bCwabdzaCMbo4m5ejIURpzTofdyaaKWrmJERwYuryslcPTGWwhGgMtWNZIcmBWOqr4Mzt_v76XpfnLTiGDA-eHxSQoAynmHo51WihgL5FQxW0xNssPCGStiKhfLfiNE_t4XHUBmBom-WoLVq3U7W4QXXAdPCrz7hj3_E1LV0uZ_8EjpeNBpwGoj27u3RwLMmcjXxEC9np_Wlabme3C6mzc8I-XdbRNN3o7wSyJCukSwV8XyaM7IW");

				const requestOptions = {
					method: "GET",
					headers: myHeaders,
					redirect: "follow"
				};

				try {
					const response = await fetch("https://ubiquitous-parakeet-wqxj59w67w7h9p5j-3001.app.github.dev/api/account-detail/1", requestOptions);
					const result = await response.json();
					setStore({ detailAccounts: result.result });
				} catch (error) {
					console.error(error);
				};
			}
		}
	};
};

export default getState;
