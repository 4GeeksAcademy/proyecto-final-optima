const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			theme: localStorage.getItem("theme") || "light", //estado modod clarp/oscuro (alamcena el tema)
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
			accounts: JSON.parse(localStorage.getItem("userAccounts")) || [],
			auth: !!localStorage.getItem("token"), // Verifica si hay un token para mantener la sesión activa
			detailAccounts: [],
			detailUser: [],
		},
		actions: {
			initializeTheme: () => { //se ejecuta cuando la app se cargue para caragar el tema correcto
				const savedTheme = localStorage.getItem("theme") || "light";
				document.documentElement.setAttribute("data-theme", savedTheme);
				setStore({ theme: savedTheme });
			},

			toggleTheme: () => { //cambia el tema y lo guarda en local storage
				const currentTheme = getStore().theme;
				const newTheme = currentTheme === "light" ? "dark" : "light";
				document.documentElement.setAttribute("data-theme", newTheme);
				localStorage.setItem("theme", newTheme);
				setStore({ theme: newTheme });
			},
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
			checkEmail: async (email) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/check-email`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ email })
					});
					const result = await response.json();
					return result.exists;
				} catch (error) {
					console.error("Error verificando email:", error);
					return false;
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
				localStorage.removeItem("userAccounts")
				setStore({ auth: false, user: "", accounts: [] });
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
				const userAccounts = JSON.parse(localStorage.getItem("userAccounts"));

				if (userLogged) {
					setStore({ user: userLogged });
				}
				if (userAccounts) {
					setStore({ accounts: userAccounts });
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
					const userAccounts = JSON.parse(localStorage.getItem("userAccounts"));
					if (userAccounts === null) {
						const response = await fetch(`${process.env.BACKEND_URL}/api/user/${getStore().user.id}/accounts`, requestOptions);
						const result = await response.json();
						const userAccounts = await result.result

						if (userAccounts !== undefined) {
							localStorage.setItem("userAccounts", JSON.stringify(userAccounts));
							setStore({ accounts: userAccounts });
						}
					} else { setStore({ accounts: userAccounts }) }
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
			getAccountsDetail: async (accountId) => {
				const myHeaders = new Headers();
				myHeaders.append("Cookie", ".Tunnels.Relay.WebForwarding.Cookies=CfDJ8Cs4yarcs6pKkdu0hlKHsZuR5ZcgQ2KTnWDNr3AUt8ybBx2u9D6V4wNy29qq0uvKyt0dEmrGGzWX4XiYfTpuTAnKnIIv9Ln23w-4vAGompckgCekREzckivfx1EFoIdA_AtlfZC_VbnLv9vgzTXZ6J6j0Di2KszNcr_soZxDjxwalD3Kt4nhLxxrSE_36qp-s6R7bRAfnfsIM2JBE5HftxL7unD6bUCWegqmIaXAb4JCjVtFJZNT1RoiDzvsZJNVHF6FHsyBtcLNb5CwUMf1GC_A06IGE0OaLbfaZ1CeGVbdQPtviNt_zvkPlfWZfM8-g1mepf4HIM_UaH1whZxYKiQgPvpBRb5-T_4FFOSba0d8VRwHK_VMicGi3ju5BqujVmLHBnJ98EjagWnxF9g8PCi_JuLb3N2yVvgFuw0T5m17lX_5_BHBjJD4laB6jRX1Qbhi_Yiuolg2-48UKfr_cgFlzx3MUCJcQdlQeNOX2LYEgRjDbHwACpZTTG6R32om-lrBu4TBD073sxXitNjFT98geeeONMbTuhEGgyql-qzfTYqWLeuAt062SQuuOpUCHMw7pdbO1vZVcLV3dg-Sd8l0XFINELsMYGmh5YSVmzHttBNXZj2G8Nx51HVlrHVH6lWegB6znFO_KKsWK1jW-kkrXmstr88RphGCYQhZVAzoI8ag4ddz0JMZYgB6wDPIVeTIVAcy57sDfPekzK_cIKNKTEs7yRCREiUT36s-xTqghLmXXgUyLMs_bCwabdzaCMbo4m5ejIURpzTofdyaaKWrmJERwYuryslcPTGWwhGgMtWNZIcmBWOqr4Mzt_v76XpfnLTiGDA-eHxSQoAynmHo51WihgL5FQxW0xNssPCGStiKhfLfiNE_t4XHUBmBom-WoLVq3U7W4QXXAdPCrz7hj3_E1LV0uZ_8EjpeNBpwGoj27u3RwLMmcjXxEC9np_Wlabme3C6mzc8I-XdbRNN3o7wSyJCukSwV8XyaM7IW");

				const requestOptions = {
					method: "GET",
					headers: myHeaders,
					redirect: "follow"
				};

				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/account-detail/${accountId}`, requestOptions);
					const result = await response.json();
					if (response.status === 404) {
						setStore({ detailAccounts: [] });
					} else {
						setStore({ detailAccounts: result.result });
					}
				} catch (error) {
					console.error(error);
				};
			},
			getDetailsUser: async () => {
				const myHeaders = new Headers();
				myHeaders.append("Cookie", ".Tunnels.Relay.WebForwarding.Cookies=CfDJ8Cs4yarcs6pKkdu0hlKHsZvKzJXDVBHphtOe1cSnqI_WGNBarWhekoBngCO2L9aYlZiJZUNFSo5r6cRa1JZRnt3tDvDF7Ju8HsF2_wlVv6d0ngzEe4a3p9kAtLbD6rh_dEsHrRyOxji_W_JZ67fyLveQiXL8UZVJYCCDsVb26VZawDK9kIiScx5KxSTSj9fXlfvWGiKyO1NK7HF7v3CdrAEgrAp3y3GneVFRM5C-VLorUQPAs2R8-ulbHmZ5QLKJgTZsc2FV-hOEihiDEvLylJFB7O4haThOGoBKAeZePyZDS1vF-uJHnMExb4tI79wAwEI7HylZ4cDyhrfSS1R989N5Z7pFfGGBuZRaBU0H2hYFgQKtG6FX7BJbKFmx9pdEa-d35nRp61B-Y7PziEKt4XKXeJAsWHr4uz2sQH2V23dFU_9jMDT5jhwKbjAXKQPCDs8FLaLnpVSmCX8mmhr5uuqzGIzVrNf-ZVyayh8VOSXPiB1BWzZQ-CINZAeQyMx2roVt5gAOjI1KMzdF6hWZ78HmZkJHDbNSB33E3G318NRiV1Qb1xLO8C1GUyog-wiuhN04ESi6ruAZcD4x34oMf7v7Vp228UHPGNmUpJ8x9Cd6MaS-3TCP0Drkh8A_rm5locNIzdd-tfanE_TuIlSr0UHQKATw32jDN1d8VKow_lEYXLywe0aGGGz8GYH7YVa4gJscmvfybNB2SUCJ4bipGYjjv9WQYICX34cZvy8wssoTQ7_0emJ38N4wlqHftWwgIcPYGH7dKLgoUphJf02r3d9XD1IGHqRJApYMERVINOwh6whQCuwCxjD9vlXf7lwqS_BhY2K51zPsm-xnwd9fnVBxdwoMw5W84pQwh-P3QymFJ7EiZ7P8zSO-26wt_0XY9l3EojptbOYi6zYyHWIXUvdkqBKJUDCR4QVYz9pWk2y09zVO8sKpVfIXUXTLtRdPlHUb_SNdecaAti632itSi1bCwOWkmYkiB25Q-EwNHwHA");

				const requestOptions = {
					method: "GET",
					headers: myHeaders,
					redirect: "follow"
				};

				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/all-details-user/${getStore().user.id}`, requestOptions);
					const result = await response.json();
					if (response.status === 404) {
						setStore({ detailUser: [] });
					} else {
						setStore({ detailUser: result.result });
					}

				} catch (error) {
					console.error(error);
				};
			},
			DeleteAccount: async (accountId) => {
				const myHeaders = new Headers();
				myHeaders.append("Cookie", ".Tunnels.Relay.WebForwarding.Cookies=CfDJ8Cs4yarcs6pKkdu0hlKHsZvSYfPWBkxG1uAm4mVA7Kzrj3ZVWCO8__RlrXh3GAYOYP60v1Qc9b7TGpa1XgNWgd8W415NnC8GpdC7Xc5MGCF8g1WuD1ANQXhy8XvefAPkOaRIYoANo4q1cGB3UZeiRGv70Cx-3sLfjgfGYEQvXrSM8oQbDcLxAL2dbdoUgOmDHZNBHR_IOIki5cheIuRAutcTglmZ1FTZk3sSbqKZWIklGPs-l8SUEklJ4Cco9JFWSSexleEBIamFx3zRMzjzohwrRd_ZvoX0GCcDM7DV6b7TSeAauinxrg1NGYfR1u9Jg_DJtznD3CbdY2dCv3qaLt46iM2yG69rYJcHGEDa_XLE2PpaoGFvVvjca40ZC_YLFr5H7R-jBlUWwknosbDVyrhB4lUr8z55Q9ozFDRWuDqVHHpn97LKTtSTHjTRGq6M1Ob0e01xACOSjXIzGa4Q3H2cAGIM1EvK9uhTorDWEGMw7YlwY1WR6kL3OyCjYQkuhV61jsR2uHu9oJ4lPsWjwAHsW_5KyBavHQCQ1yhmMCmuvgPUG7RBfn8f9e6qqbbvMfdVarI3KcNqnpA_aJK8LYJpAv8TegQY1R-BhJrsZ4gRbzZDPY1kHP_Qhkf-rmIfn5KkNGgKugjCHTaHbiUGqqqncKdfNIJeeufVSolDtXjH-eAtWZRD7KEWzpa3DQcfmn2AvBkX0ilK1N778dl_qdhYyBEgANw5fkx90lIMulItK-UYaiwLH1xkprzZh3Nzzli1QlrziJYyre1LNHXCa9ru3DnUjMXUy-Raww2j1e17fIWHj_zj9wsZSwFZ1gQ6N3PswEJIoAiNOKfWJUXs-xu7iIDifiVBwK1sflIq76UHgz3Fup9cgva0oIq6Evq5otAB_wMNmBxuhyRcsCJt8ShtruqEPIQiAudQ2aY9T6hq0M0A4ku9CMqZ2HjhjyWxVjxVX471uhzwvv-WKXedAgIh5xz6s2uZCVYlU075Eb2B");

				const requestOptions = {
					method: "DELETE",
					headers: myHeaders,
					redirect: "follow"
				};

				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/delete-account/${accountId}`, requestOptions);
					const result = await response.json();
					if(response.status === 200){
						localStorage.removeItem("userAccounts")
						getActions().getAccountsUser();
					}
				} catch (error) {
					console.error(error);
				};
			},
			filterPerType: async () => {
				const myHeaders = new Headers();
				myHeaders.append("Cookie", ".Tunnels.Relay.WebForwarding.Cookies=CfDJ8Cs4yarcs6pKkdu0hlKHsZs4QIjnH5XwZc8r4EV9eZWrSae0Zb1F4WdnE7Ev9oY4WsQBWsicWZUNpx6ZWsGv-Wn3x_D_8Smp803mzklASXl2lEA7pd1-gKaWYVpJqV89E3xDpwb9emCOmfyGyT0wu23zONmmNe8tjf9JQD1ZEQjLeZuA3oWO6SxQTY1Upd-3O9zUY604pNU5_4BWprsnN66EnjeUG5GjHH5uEJIhJwstjSS5BvVukVWrNwfj1DEH69Tz_4I_0JhOtqVwAfb_Bh5YBmLWH3ESGNgzKOzfckF5kWvsYcMLi_kj2UJYxgsfBWrSgkymz1mVgf8gKukkwmR678lWfuJDVrq7ZGN64ZNiK8OUH1cRbN8ehT1xMG-XFCi7XR6fKyJgQKGPBH4sB8koBIzHQxd2RqazUx3sbvYxv4_3PhX6Z0j6Yj5klQadzS1qPqK8FVHqMIdmwPZ0S9PIlD0hDcz1e0gmHVDuk7BTH8W52Ftn5VlS0RB9Ge7hD24-3fytorvEZ6sFVE27xBPv5m7hk2EeCVa6UUQR7rRlFRVHn94C9joOncvUJpfZ7jcNDsK1PQ9tkGUt0HP86D5qdcFENkZraEEmTVU2fcpQ98gG_prmadxOyijK09ccnN917DenzVFaJjId_AK--54GW_tJg_iMoTA-LjuCo-fRRyTWBnV4_5RfsDg3BC8HTCPe7rBNUbCRTr8YemjlYKzREfH4jvwpoKKgaVpNH_SNdqCg7ZFmS4u6DPV71LczGyfFHMD2SCd8LDFhVe7m-0fpWXuDFGsF1zEJWnIwHn-wUWdO6A63QHqSL5V6F7-D0doiUy3j9-Ad3P3e_Z3ImcecNahAqh6YuF3wtg7ePacPp2becXJ4IONIoYuf_ZTKI3r8nfV6LEl0p4LWvBRc4AFGZ88ioPBEJ8HCfPGVU_NjLp6nwH1kDSNfGxTc8UFAV4pemvQ8xV7YVMma5KgdIhn2FFSD6FiKiwQLKvk0UP4OFgtd4y8B0PKJmGXy1phdXg");

				const requestOptions = {
					method: "GET",
					headers: myHeaders,
					redirect: "follow"
				};

				try {
					const response = await fetch("https://super-duper-space-bassoon-jp9w74x6j5xcprq7-3001.app.github.dev/api/account-detail-filter/1", requestOptions);
					const result = await response.text();
					console.log(result)
				} catch (error) {
					console.error(error);
				};
			},
		}
	};
};

export default getState;
