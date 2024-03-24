function permission(isInWhiteList: boolean) {
  const token = localStorage.getItem("token");
  if (!token && !isInWhiteList) {
    window.location.replace("/login");
  }
}

export default permission;
