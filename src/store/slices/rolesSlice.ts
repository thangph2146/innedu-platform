import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Role {
    id: string | null;
    name: string;
    description: string;
}

interface RolesPermissionResponse {
    total: number;
    data: Role[];
    has_more: boolean;
    page: number;
    per_page: number;
}

interface RolesState {
    permissions: RolesPermissionResponse | null;
}

const initialState: RolesState = {
    permissions: {
        "total": 5,
        "data": [
            {
                "id": null,
                "name": "SUPER_ADMIN",
                "description": "Super Admin"
            },
            {
                "id": "755c0b2a-a191-4d48-83e4-e303235e829c",
                "name": "ADMIN",
                "description": "Admin"
            },
            {
                "id": "d78c9b8e-42a1-4778-81d3-1657cb8d3101",
                "name": "USER",
                "description": "User"
            },
            {
                "id": "53ab2dbc-e629-44df-b02d-7417dee26ed7",
                "name": "ACCOUNTANT",
                "description": "Accountant"
            },
            {
                "id": "1b98dafe-f1f2-44f9-8bdd-bc0692590c36",
                "name": "PARTNER",
                "description": "Partner"
            }
        ],
        "has_more": false,
        "page": 1,
        "per_page": 5
    }
};

const rolesSlice = createSlice({
    name: 'roles',
    initialState,
    reducers: {
        setRolesPermission: (state, action: PayloadAction<RolesPermissionResponse>) => {
            state.permissions = action.payload;
        },
        clearRolesPermission: (state) => {
            state.permissions = null;
        }
    }
});

export const { setRolesPermission, clearRolesPermission } = rolesSlice.actions;
export default rolesSlice.reducer; 