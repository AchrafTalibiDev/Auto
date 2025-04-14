import { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [accounts, setAccounts] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);

    // Récupérer les données des comptes et des logs
    const fetchData = async () => {
        const accRes = await axios.get('http://localhost:5000/api/accounts');
        const logRes = await axios.get('http://localhost:5000/api/accounts/logs');
        setAccounts(accRes.data);
        setLogs(logRes.data);
    };

    // Effectuer la récupération des données lors du chargement du composant
    useEffect(() => {
        fetchData();
    }, []);

    // Fonction pour démarrer l'automatisation Gmail
    const handleGmailAutomation = async () => {
        setLoading(true);
        try {
            await axios.post('http://localhost:5000/api/accounts/start-gmail');
            await fetchData(); // actualiser les données après l'automatisation
        } catch (err) {
            console.error('Erreur lancement automatisation Gmail:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-blue-800     p-8 font-sans">
            {/* Conteneur principal qui occupe toute la hauteur de l'écran */}
            <div className="flex flex-col justify-start items-start h-full">

                {/* Titre centré en haut */}
                <h1 className="text-4xl font-bold mb-8 text-center text-blue-800">Dashboard Automatisation Gmail</h1>

                {/* Conteneur du bouton centré */}
                <div className="flex justify-start items-start">
                    <button
                        onClick={handleGmailAutomation}
                        className="bg-blue-800 hover:bg-blue-800 text-black font-semibold py-8 px-20 text-3xl rounded-lg shadow-xl transition duration-300 transform hover:scale-110"
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="flex justify-start items-start">
                                <div className="w-12 h-12 border-t-2 border-white border-solid rounded-full animate-spin"></div>
                                <span className="ml-3">Lancement en cours...</span>
                            </div>
                        ) : (
                            'Lancer Gmail'
                        )}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;