import { Loader2 } from "lucide-react";

export default function BookingFormUI({
  formData,
  setFormData,
  onSubmit,
  submitting,
}: any) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label className="text-sm font-medium">Full Name</label>
        <input
          value={formData.name}
          onChange={(e) =>
            setFormData((prev: any) => ({
              ...prev,
              name: e.target.value,
            }))
          }
          className="input"
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium">Phone</label>
        <input
          value={formData.phone}
          onChange={(e) =>
            setFormData((prev: any) => ({
              ...prev,
              phone: e.target.value,
            }))
          }
          className="input"
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) =>
            setFormData((prev: any) => ({
              ...prev,
              email: e.target.value,
            }))
          }
          className="input"
          required
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full h-12 bg-indigo-600 text-white rounded-lg flex items-center justify-center"
      >
        {submitting ? (
          <Loader2 className="animate-spin" />
        ) : (
          "Confirm Appointment"
        )}
      </button>
    </form>
  );
}