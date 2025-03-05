from app import db, bcrypt  # Import database and bcrypt for password hashing

class User(db.Model):
    """Defines the User model for authentication."""
    id = db.Column(db.Integer, primary_key=True)  # Unique user ID
    email = db.Column(db.String(120), unique=True, nullable=False)  # User email (must be unique)
    password_hash = db.Column(db.String(256), nullable=False)  # Hashed password

    def set_password(self, password):
        """Hashes the given password and stores it."""
        self.password_hash = bcrypt.generate_password_hash(password).decode("utf-8")

    def check_password(self, password):
        """Checks if the provided password matches the stored hash."""
        return bcrypt.check_password_hash(self.password_hash, password)
