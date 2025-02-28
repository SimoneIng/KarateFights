import * as Updates from 'expo-updates'; 
import { useState } from 'react';

const useUpdates = () => {

    const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
    const [updateError, setUpdateError] = useState<string | null>(null); 

    async function checkForUpdates() {
        setIsCheckingUpdate(true); 

        try {
            const update = await Updates.checkForUpdateAsync();
            
            if (update.isAvailable) {
            await Updates.fetchUpdateAsync();
            // Riavvia l'app per applicare l'aggiornamento
            await Updates.reloadAsync();
            }
        } catch (error: any) {
            // Gestione degli errori
            setUpdateError(error.toString());
        } finally {
            setIsCheckingUpdate(false); 
        }
    }

    return { isCheckingUpdate, updateError, checkForUpdates }

}

export default useUpdates; 