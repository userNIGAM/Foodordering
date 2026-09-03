import { useState } from "react";

const IssueModal = ({ orderId, actionLoading, onReport, onClose }) => {
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    await onReport(orderId, description);

    setDescription("");
    onClose();
  };

  return (
    <div
      className="modal d-block"
      style={{
        backgroundColor: "rgba(0,0,0,0.5)",
      }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">⚠️ Report Issue</h5>

            <button type="button" className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body">
            <textarea
              className="form-control"
              rows="4"
              placeholder="Describe the issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="button"
              className="btn btn-danger"
              onClick={handleSubmit}
              disabled={actionLoading}
            >
              {actionLoading ? "..." : "Report Issue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueModal;
