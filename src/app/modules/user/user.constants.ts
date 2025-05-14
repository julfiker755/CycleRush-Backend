export const userRole = ['super_admin', 'admin', 'doctor', 'patient'] as const;
export const userStatus = ['active', 'blocked', 'deleted'] as const;

export const Role = Object.fromEntries(userRole.map((role, i) => [role, role])) as {
    [K in typeof userRole[number]]: K;
  }

