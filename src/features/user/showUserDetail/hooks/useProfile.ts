import { useCallback, useEffect, useState } from "react";
import { getProfile } from "../data/profile";
import { ComprehensiveProfile } from "../types/profile";

export default function useProfile(userId: string | null) {
    const [profile, setProfile] = useState<ComprehensiveProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = useCallback(async () => {
        if (!userId) {
            setProfile(null);
            setLoading(false);
            setError(null);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const profileData = await getProfile(userId);
            setProfile(profileData as ComprehensiveProfile);
        } catch (err) {
            setError("Failed to fetch profile");
            console.error("Error fetching profile:", err);
            setProfile(null);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    // Expose refetch function for manual updates
    const refetch = useCallback(() => {
        fetchProfile();
    }, [fetchProfile]);

    return { profile, loading, error, refetch };
}
