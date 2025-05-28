import { Contact } from "../types/contact";
import useAuth from "./useAuth";
import { addContactApi } from "../data/applications";
import { toast } from "sonner";

export function useContactManagement() {
    const { user } = useAuth();
    /**
     * Adds a new contact to the database.
     * @param contact - The contact object to be added.
     * @returns A promise that resolves to the created contact.
     */
    const addContact = async (contact: Contact) => {
        if (!user) return;
        try {
            const newContact = await addContactApi({
                ...contact,
                user_id: user.id,
            });
            toast.success("Contact added successfully!");
            return newContact;
        } catch (error) {
            console.error("Failed to add contact:", error);
            toast.error("Failed to add contact. Please try again.");
            throw error;
        }
    };
    return {
        addContact,
    };
}
