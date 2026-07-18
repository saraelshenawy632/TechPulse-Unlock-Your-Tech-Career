import Swal from "sweetalert2";
import { toast } from "react-toastify";

// =====================================
// Confirm Dialog
// =====================================

export async function confirmDelete(message) {

    const result = await Swal.fire({

        title: "Are you sure?",

        text: message,

        icon: "warning",

        showCancelButton: true,

        confirmButtonText: "Yes, Delete",

        cancelButtonText: "Cancel",

        confirmButtonColor: "#dc2626",

        cancelButtonColor: "#475569",

        background: "#0f172a",

        color: "#ffffff",

        reverseButtons: true

    });

    return result.isConfirmed;

}

// =====================================
// Success Toast
// =====================================

export function success(message) {

    toast.success(message, {

        position: "top-right"

    });

}

// =====================================
// Error Toast
// =====================================

export function error(message) {

    toast.error(message, {

        position: "top-right"

    });

}

// =====================================
// Warning Toast
// =====================================

export function warning(message) {

    toast.warning(message, {

        position: "top-right"

    });

}

// =====================================
// Info Toast
// =====================================

export function info(message) {

    toast.info(message, {

        position: "top-right"

    });

}