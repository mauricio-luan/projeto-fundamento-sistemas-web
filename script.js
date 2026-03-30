document.addEventListener("DOMContentLoaded", () => {
    setCurrentYear();
    highlightCurrentPage();
    startClock();
    prepareScheduleDate();
    setupBookingForm();
});

function setCurrentYear() {
    const year = new Date().getFullYear();
    document.querySelectorAll("[data-current-year]").forEach((element) => {
        element.textContent = year;
    });
}

function highlightCurrentPage() {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll("[data-nav-link]").forEach((link) => {
        const isCurrentPage = link.getAttribute("href") === currentPage;

        if (isCurrentPage) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        }
    });
}

function startClock() {
    const clock = document.querySelector("[data-clock]");

    if (!clock) {
        return;
    }

    const updateClock = () => {
        const now = new Date();
        const formatted = now.toLocaleString("pt-BR", {
            dateStyle: "full",
            timeStyle: "short"
        });

        clock.textContent = `Atendimento online: ${formatted}`;
    };

    updateClock();
    window.setInterval(updateClock, 1000 * 60);
}

function prepareScheduleDate() {
    const dateField = document.querySelector("#agendamento-data");

    if (!dateField) {
        return;
    }

    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    dateField.min = `${today.getFullYear()}-${month}-${day}`;
}

function setupBookingForm() {
    const form = document.querySelector("#booking-form");
    const confirmationBox = document.querySelector("#booking-feedback");

    if (!form || !confirmationBox) {
        return;
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const service = formData.get("servico");
        const method = formData.get("agendamento");
        const petName = formData.get("pet_nome");
        const clientName = formData.get("cliente_nome");
        const date = formData.get("agendamento_data");
        const time = formData.get("agendamento_hora");

        if (!service || !method || !date || !time) {
            confirmationBox.className = "alert alert-danger confirmation-box is-visible";
            confirmationBox.textContent = "Preencha o serviço, a forma de agendamento, a data e o horário desejados.";
            return;
        }

        const summary = {
            cliente: clientName,
            pet: petName,
            servico: service,
            agendamento: method,
            data: date,
            hora: time
        };

        localStorage.setItem("petshopBooking", JSON.stringify(summary));

        confirmationBox.className = "alert alert-success confirmation-box is-visible";
        confirmationBox.innerHTML = buildConfirmationMessage({
            clientName,
            petName,
            service,
            date,
            time,
            method
        });

        form.reset();
        prepareScheduleDate();
    });
}

function buildConfirmationMessage({ clientName, petName, service, date, time, method }) {
    return `
        Cadastro registrado com sucesso.<br>
        Cliente: <strong>${escapeHtml(clientName)}</strong>.<br>
        Pet: <strong>${escapeHtml(petName)}</strong>.<br>
        Serviço: <strong>${escapeHtml(service)}</strong> em <strong>${escapeHtml(date)}</strong> às <strong>${escapeHtml(time)}</strong>.<br>
        Modalidade: <strong>${escapeHtml(method)}</strong>.
    `;
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}
