import useDeliveryDashboard from "./hooks/useDeliveryDashboard";
import DashboardHeader from "./components/DashboardHeader";
import StatsCards from "./components/StatsCards";
import ActiveDeliveriesTable from "./components/ActiveDeliveriesTable";
import PendingPickups from "./components/PendingPickups";
import LocationModal from "./components/LocationModal";

const DeliveryDashboard = () => {
  const dashboard = useDeliveryDashboard();

  if (dashboard.loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border"></div>
      </div>
    );
  }

  return (
    <div className="delivery-dashboard container-fluid py-4">

      <DashboardHeader
        deliveryPerson={dashboard.deliveryPerson}
        isConnected={dashboard.isConnected}
      />

      <StatsCards stats={dashboard.stats} />

      <ActiveDeliveriesTable
        deliveries={dashboard.deliveries}
        actions={dashboard.actions}
      />

      <PendingPickups
        deliveries={dashboard.deliveries}
        pickupOrder={dashboard.actions.pickupOrder}
      />

      <LocationModal
        show={dashboard.showLocationModal}
        locationForm={dashboard.locationForm}
        setLocationForm={dashboard.setLocationForm}
        updateLocation={dashboard.actions.updateLocation}
        close={() => dashboard.setShowLocationModal(false)}
      />

    </div>
  );
};

export default DeliveryDashboard;